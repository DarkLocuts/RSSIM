"use client";

import { useEffect, useMemo, useState } from "react";
import { faArrowLeft, faArrowRight, faEdit, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";
import { api, ApiType, UseResourceProps, useTable } from "@utils";
import { TableComponent, ButtonComponent, IconButtonComponent, InputRadioComponent, BottomSheetComponent } from "@components";
import { useToggleContext } from "@contexts";



type ExportColumn = {
  selector  :  string;
  label     :  string;
  source    :  string | null;
};

export type ExportExcelColumnControlType = {
  label     :  string;
  selector  :  string;
};

type ExportExcelProps = {
  fetchControl    :  UseResourceProps;
  columnControl  ?:  ExportExcelColumnControlType[];
  filename       ?:  string;
};



const ADD_COLUMN_KEY = "__add_column__";

function numberToExcelColumn(index: number): string {
  let column  =  "";
  let n       =  index;

  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column;
    n = Math.floor(n / 26) - 1;
  }

  return column;
}



export function ExportExcel({ fetchControl, columnControl, filename }: ExportExcelProps) {
  const { toggle, setToggle } = useToggleContext()

  const { data, tableControl } = useTable(fetchControl, undefined, undefined, false);

  const fields = useMemo(() => {
    if (columnControl?.length) {
      return columnControl.map(c => c.selector);
    }

    if (!data?.data?.[0]) return [];
    return Object.keys(data.data[0]);
  }, [data, columnControl]);

  const [columns, setColumns] = useState<ExportColumn[]>([]);


  useEffect(() => {
    if (!data?.data?.[0]) return;

    setColumns(prev => {
      if (prev.length) return prev;

      const baseFields = columnControl?.length ? columnControl.map(c => c.selector) : Object.keys(data.data[0]);

      return baseFields.map((field, i) => {
        const label = numberToExcelColumn(i);

        return {
          selector  :  label,
          label     :  label,
          source    :  field,
        };
      });
    });
  }, [data, columnControl]);


  const addColumn = (selector: string, source: string) => {
    setColumns(prev => [...prev, { selector, label: selector, source }]);
  };

  const removeColumn = (selector: string) => {
    setColumns(prev => prev.filter(c => c.selector !== selector).map((c, i) => {
      const label = numberToExcelColumn(i);
      return { ...c, selector: label, label };
    }));
  };

  const moveColumn = (selector: string, dir: "left" | "right") => {
    setColumns(prev => {
      const idx = prev.findIndex(c => c.selector === selector);
      if (idx === -1) return prev;

      const target = dir === "left" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];

      return next.map((c, i) => {
        const label = numberToExcelColumn(i);
        return { ...c, selector: label, label };
      });
    });
  };

  const setSource = (selector: string, source: string | null) => setColumns(prev => prev.map(c => (c.selector === selector ? { ...c, source } : c)));

  const getColumnLabel = (source: string | null) => {
    if (!source) return "";

    const found = columnControl?.find(c => c.selector === source);

    return found?.label ?? source;
  };


  const tableColumns = useMemo(() => {
    return [
      ...columns?.map((c => ({
        ...c,
        label: <div className="w-full text-center">{c.label}</div>,
        width: 250,
      }))),
      { selector: ADD_COLUMN_KEY, label: "" } as any,
    ];
  }, [columns]);

  const tableData = useMemo(() => {
    if (!data?.data || !columns.length) return [];

    const controlRow: Record<string, any> = {};

    columns.forEach((col, iCol) => {
      controlRow[col.selector] = (
        <div className="flex justify-between">
          <p className="font-semibold text-nowrap">{getColumnLabel(col.source)}</p>

          <div className="flex gap-1">
            {iCol > 0 && (
              <IconButtonComponent
                icon={faArrowLeft}
                size="xs"
                variant="outline"
                className="!text-foreground"
                onClick={() => moveColumn(col.selector, "left")}
              />
            )} 

            {iCol < (columns.length - 1) && (
              <IconButtonComponent
                icon={faArrowRight}
                size="xs"
                variant="outline"
                className="!text-foreground"
                onClick={() => moveColumn(col.selector, "right")}
              />
            )}

            <IconButtonComponent
              icon={faEdit}
              size="xs"
              paint="warning"
              variant="outline"
              disabled={columns.length <= 1}
              onClick={() => setToggle("MODAL_FIELD_EXPORT", {selector: col.selector, value: col.source})}
            />

            <IconButtonComponent
              icon={faTimes}
              size="xs"
              paint="danger"
              variant="outline"
              disabled={columns.length <= 1}
              onClick={() => removeColumn(col.selector)}
            />
          </div>

          
        </div>
      );
    });

    controlRow[ADD_COLUMN_KEY] = (
      <div className="flex justify-center">
        <ButtonComponent
          icon={faPlus}
          label="Tambah Kolom"
          size="xs"
          variant="outline"
          onClick={() => {
            const idx = columns.length;
            const label = numberToExcelColumn(idx);
            setToggle("MODAL_FIELD_EXPORT", { selector: label, value: "", add: true })
          }}
        />
      </div>
    );

    const excelRows = data.data.map((item: Record<string, any>) => {
      const row: Record<string, any> = {};

      row[ADD_COLUMN_KEY] = "-"
      columns.forEach(col => {
        row[col.selector] = col.source ? <span className="line-clamp-1">{item[col.source] || "-"}</span> : "-";
      });

      return row;
    });

    const previewData = excelRows.slice(0, 10);
    return [controlRow, ...previewData];
  }, [data, columns, fields]);

  
  const handleDownloadExcel = async () => {
    const record  =  await api({...fetchControl, params: {...(fetchControl as ApiType).params, page: 1, paginate: 9999}});
    if (!record?.data?.data?.length || !columns.length) return;

    const workbook     =  new ExcelJS.Workbook();
    const worksheet    =  workbook.addWorksheet("Export");

    worksheet.columns  =  columns.map(col => ({
      header  :  getColumnLabel(col.source),
      key     :  col.selector,
      width   :  20,
    }));

    worksheet.getRow(1).eachCell(cell => {
      cell.font       =  { bold: true };
      cell.alignment  =  { horizontal: "center", vertical: "middle" };
    });

    record.data.data.forEach((item: Record<string, any>) => {
      const row: Record<string, any> = {};

      columns.forEach(col => {
        row[col.selector] = col.source ? item[col.source] : "";
      });

      worksheet.addRow(row);
    });

    const buffer         =  await workbook.xlsx.writeBuffer();
    const blob           =  new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link           =  document.createElement("a");
    link.href            =  URL.createObjectURL(blob);
    link.download        =  filename ? filename + ".xlsx" : "export.xlsx";
    link.click();

    URL.revokeObjectURL(link.href);
  };

  

  return (
    <>
      <TableComponent
        controlBar={false}
        columns={tableColumns}
        data={tableData}
        {...tableControl}
        pagination={false}
        className="p-4 bg-background row::bg-transparent row::border-0 row::gap-0 row::!hover:bg-white column::p-2 column::border head-column::p-2 head-column::border"
      />

      <p className="mt-2 px-4 text-sm text-light-foreground">
        Menampilkan {tableData.length - 1} dari {data?.data?.length || 0} data
      </p>

      <div className="px-4 mt-8">
        <ButtonComponent 
          label="Download Excel" 
          block 
          onClick={() => handleDownloadExcel()} 
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        />
      </div>

      <BottomSheetComponent 
        show={!!toggle["MODAL_FIELD_EXPORT"]}
        onClose={() => setToggle("MODAL_FIELD_EXPORT", false)}
      >
        <div className="px-4 py-2">
          <div className="text-lg font-semibold mb-2">Pilih Kolom</div>
          <InputRadioComponent
            name={`column_${(toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector}`}
            value={(toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value ?? ""}
            onChange={e => setToggle("MODAL_FIELD_EXPORT", {...(toggle["MODAL_FIELD_EXPORT"] as object), value: e})}
            options={fields.map((f: string) => ({
              label: columnControl?.find((c: any) => c.selector === f)?.label || f,
              value: f,
            }))}
            vertical
          />

          <div className="mt-4">
              <ButtonComponent 
                label="Terapkan"
                onClick={() => {
                  if(!!(toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value) {
                    if((toggle["MODAL_FIELD_EXPORT"] as { add: boolean })?.add) {
                      addColumn((toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector, (toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value)
                    } else {
                      setSource((toggle["MODAL_FIELD_EXPORT"] as { selector: string })?.selector, (toggle["MODAL_FIELD_EXPORT"] as { value: string })?.value)
                    }
                  }
                  setToggle("MODAL_FIELD_EXPORT", false)
                }}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-5"
                block
              />
            </div>
        </div>
      </BottomSheetComponent>
    </>
  );
}
