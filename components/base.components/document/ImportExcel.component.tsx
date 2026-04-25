"use client";

import { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { faEdit, faCloudUploadAlt, faFileExcel, faFileCsv, faTimes, faSync, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableComponent, ButtonComponent, SelectComponent, ModalComponent, IconButtonComponent, BottomSheetComponent, InputRadioComponent, ModalConfirmComponent, ToastComponent } from "@components";
import { useToggleContext } from "@contexts";
import { api, ApiType, cn, useResponsive } from "@utils";

export type ImportExcelColumnControlType = {
  label: string;
  selector: string;
  required?: boolean;
};

type ImportColumn = {
  selector  :  string;
  label     :  string;
  source    :  string | null;
};

type ImportExcelProps = {
  columnControl  :  ImportExcelColumnControlType[];
  submitControl  :  ApiType
};



function numberToExcelColumn(index: number): string {
  let column = "";
  let n = index;

  while (n >= 0) {
    column = String.fromCharCode((n % 26) + 65) + column;
    n = Math.floor(n / 26) - 1;
  }

  return column;
}



export function ImportExcel({ columnControl, submitControl }: ImportExcelProps) {
  const { toggle, setToggle }  =  useToggleContext()

  const [columns, setColumns]  =  useState<ImportColumn[]>([]);
  const [rows, setRows]        =  useState<Record<string, any>[]>([]);
  const [loaded, setLoaded]    =  useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { isSm }  =  useResponsive();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleImportFile(file);
    }
  };


  const handleImportFile = async (file: File) => {
    const workbook  =  new ExcelJS.Workbook();
    const buffer    =  await file.arrayBuffer();

    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];

    const excelColumns: ImportColumn[] = [];
    sheet.getRow(1).eachCell((_, colIndex) => {
      const label = numberToExcelColumn(colIndex - 1);

      excelColumns.push({
        selector  :  label,
        label     :  label,
        source    :  null,
      });
    });

    const excelRows: Record<string, any>[] = [];
    sheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const item: Record<string, any> = {};
      excelColumns.forEach((col, i) => {
        item[col.selector] = row.getCell(i + 1).value;
      });

      excelRows.push(item);
    });

    setColumns(excelColumns);
    setRows(excelRows);
    setLoaded(true);
  };

  const getColumnLabel = (source: string | null) => {
    if (!source) return "";

    const found = columnControl?.find(c => c.selector === source);

    return (
      <span className="flex items-center gap-1">
        {found?.label ?? source}
      </span>
    );
  };

  const isSubmitDisabled = useMemo(() => {
    const requiredSelectors = columnControl.filter(c => c.required).map(c => c.selector);
    const mappedSelectors = columns.filter(col => col.source).map(col => col.source);
    
    return !requiredSelectors.every(selector => mappedSelectors.includes(selector));
  }, [columnControl, columns]);


  const tableColumns = useMemo(() => {
    return columns?.map((c => ({
      ...c,
      label: <div className={cn("w-full text-center transition-opacity duration-300", !c.source && "opacity-60")}>{c.label}</div>,
      item: (data: any) => {
        const value = data[c.selector];
        const isMapping = !!data._isMapping;
        return <div className={cn("transition-opacity duration-300 w-full line-clamp-1", !isMapping && !c.source && "opacity-50")}>{value}</div>
      }
    })));
  }, [columns]);


  const tableData = useMemo(() => {
    if (!loaded) return [];

    const mappingRow: Record<string, any> = { _isMapping: true };

    columns.forEach(col => {
      mappingRow[col.selector] = (
        <>
          <div className="flex justify-between">
            <p className="font-semibold line-clamp-1">{getColumnLabel(col.source) || <span className="text-light-foreground">-- PILIH KOLOM --</span>}</p>

            <div className="flex gap-2">
              <IconButtonComponent
                icon={faEdit}
                size="xs"
                paint="warning"
                variant="outline"
                disabled={columns.length <= 1}
                onClick={() => setToggle("MODAL_FIELD_IMPORT", {selector: col.selector, value: col.source})}
              />

              {col.source && (
                <IconButtonComponent
                  icon={faTimes}
                  size="xs"
                  paint="warning"
                  variant="outline"
                  disabled={columns.length <= 1}
                  onClick={() => {
                    setColumns(prev => prev.map(c => c.selector === col.selector ? { ...c, source: null } : c))
                  }}
                />
              )}
            </div>
          </div>
        </>
      );
    });

    const previewRows = rows.slice(0, 10);
    return [mappingRow, ...previewRows];
  }, [columns, rows, loaded, columnControl]);


  const generatePayload = () => {
    return rows.map(row => {
      const payload: Record<string, any> = {};

      columns.forEach(col => {
        if (col.source) {
          payload[col.source] = row[col.selector];
        }
      });

      return payload;
    });
  };

  const submit = async () => {
    setToggle("IMPORT_LOADING")

    const payload = generatePayload();

    const execute = await api({ 
      ...submitControl, 
      headers: { "Content-Type": "application/json" }, 
      payload: payload 
    })
    
    if (execute.status == 200) {
      setToggle("IMPORT_LOADING", false)
      setToggle("IMPORT_SUCCESS")
      setToggle("IMPORT_CONFIRM", false)
      setColumns([])
      setRows([])
      setLoaded(false)
    } else {
      setToggle("IMPORT_LOADING", false)
      setToggle("IMPORT_FAILED")
      setToggle("IMPORT_CONFIRM", false)
    }
  };

  return (
    <>
        {!loaded && (
          <div 
            className={cn(
              "relative group transition-all duration-300 ease-in-out",
              dragActive ? "scale-[1.02]" : "scale-100"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div 
              className={cn(
                "bg-white rounded-3xl p-10 md:p-16 border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 w-full",
                dragActive ? "border-primary bg-light-primary/10" : "border-slate-200 hover:border-light-primary hover:bg-slate-50/50"
              )}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-light-primary/10 text-primary group-hover:scale-110">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl" />
              </div>

              <p className="text-foreground font-semibold text-lg text-center px-4">
                Ketuk atau tarik file ke sini
              </p>
              <p className="text-light-foreground text-sm mt-3 flex items-center gap-3">
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faFileExcel} className="text-green-600" /> .xlsx</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faFileCsv} className="text-blue-500" /> .csv</span>
              </p>

              <p className="text-light-foreground text-sm mt-6 font-semibold">Ukuran Maksimal 10MB</p>
              <input
                type="file"
                accept=".xlsx, .csv"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleImportFile(file);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        {loaded && (
          <>
            <TableComponent
              controlBar={false}
              columns={tableColumns}
              data={tableData}
              pagination={false}
              noIndex
              className=" bg-background row::bg-white row::border-0 row::gap-0 row::!hover:bg-white column::p-2 column::border head-column::p-2 head-column::border"
            />

            <p className="mt-2">Menampilkan {tableData.length - 1} dari {rows.length}</p>
          </>
        )}

        {loaded && (
          <div className="mt-4">
            <ButtonComponent
              icon={faSync}
              label={<>Mulai Sinkronisasi <span className="bg-white/20 rounded-md px-2">{rows.length}</span></>}
              block
              loading={!!toggle["IMPORT_LOADING"]}
              onClick={() => setToggle("IMPORT_CONFIRM", true)}
              disabled={isSubmitDisabled}
              className={cn(
                "w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-5",
                isSubmitDisabled 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
              )}
            />
          </div>
        )}
      

      {!isSm ? (
        <ModalComponent
          show={!!toggle["MODAL_FIELD_IMPORT"]}
          onClose={() => setToggle("MODAL_FIELD_IMPORT", false)}
          title="Pilih Kolom"
          footer={
            <div className="flex justify-end">
              <ButtonComponent 
                label="Terapkan"
                onClick={() => {
                  if(!!(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) {
                    setColumns(prev =>
                      prev.map(c => c.selector === (toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector
                          ? { ...c, source: String((toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) }
                          : c
                      )
                    )
                  }
                  setToggle("MODAL_FIELD_IMPORT", false)
                }}
              />
            </div>
          }
        >
          <div className="p-4">
            <SelectComponent
              name={`column_${(toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector}`}
              placeholder="Pilih kolom data..."
              value={(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value ?? ""}
              onChange={e => setToggle("MODAL_FIELD_IMPORT", {...(toggle["MODAL_FIELD_IMPORT"] as object), value: e})}
              options={columnControl.map(c => ({
                label: (
                  <span className="flex items-center gap-1">
                    {c.label}
                    {c.required && <span className="text-danger">*</span>}
                  </span>
                ),
                value: c.selector,
              }))}
            />
          </div>
        </ModalComponent>
      ) : (
        <BottomSheetComponent
          show={!!toggle["MODAL_FIELD_IMPORT"]}
          onClose={() => setToggle("MODAL_FIELD_IMPORT", false)}
          size={375}
        >
          <div className="px-4 py-2">
            <div className="text-lg font-semibold mb-2">Pilih Kolom</div>
            <InputRadioComponent
              name={`column_${(toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector}`}
              value={(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value ?? ""}
              onChange={e => setToggle("MODAL_FIELD_IMPORT", {...(toggle["MODAL_FIELD_IMPORT"] as object), value: e})}
              options={columnControl.map(c => ({
                label: c.label,
                value: c.selector,
              }))}
              vertical
              className="py-4 rounded-2xl"
            />

            <div className="mt-4">
              <ButtonComponent 
                label="Terapkan"
                onClick={() => {
                  if(!!(toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) {
                    setColumns(prev =>
                      prev.map(c => c.selector === (toggle["MODAL_FIELD_IMPORT"] as { selector: string })?.selector
                          ? { ...c, source: String((toggle["MODAL_FIELD_IMPORT"] as { value: string })?.value) }
                          : c
                      )
                    )
                  }
                  setToggle("MODAL_FIELD_IMPORT", false)
                }}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-5"
                block
              />
            </div>
          </div>
        </BottomSheetComponent>
      )}


      <ModalConfirmComponent
        show={!!toggle["IMPORT_CONFIRM"]}
        onClose={() => setToggle("IMPORT_CONFIRM", false)}
        icon={faQuestionCircle}
        title="Yakin Sudah Benar?"
        submitControl={{ onSubmit: () => submit(), paint: "primary", loading: !!toggle["IMPORT_LOADING"] }}
      >
      </ModalConfirmComponent>

      <ToastComponent
        show={!!toggle["IMPORT_FAILED"]}
        onClose={() => setToggle("IMPORT_FAILED", false)}
        title="Gagal"
        className="!border-danger header::text-danger"
      >
        <p className="px-3 pb-2 text-sm">
          Data gagal disimpan, cek data dan koneksi internet lalu coba kembali!
        </p>
      </ToastComponent>

      <ToastComponent
        show={!!toggle["IMPORT_SUCCESS"]}
        onClose={() => setToggle("IMPORT_SUCCESS", false)}
        title="Berhasil"
        className="!border-success header::text-success"
      >
        <p className="px-3 pb-2 text-sm">Data berhasil disimpan!</p>
      </ToastComponent>
    </>
  );
}
