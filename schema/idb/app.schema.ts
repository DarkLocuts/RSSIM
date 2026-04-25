import { DBSchema } from "@utils/idb"

const name  =  String(process.env.NEXT_PUBLIC_APP_NAME || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + ".idb-app";

export const AppSchema: DBSchema = {
  name: name,
  version: 1,
  stores: {
    api_cache: {
      key: "key",
      fields: {
        key: "string",
        data: "json",
        expired_at: "date",
      },
      indexes: [
        { fields: "key" },
        { fields: "expired_at" },
      ],
    },
    scanneds: {
      key: "code",
      autoIncrement: true,
      fields: {
        code           :  "string",
        product_id     :  "number",
        location_id    :  "number",
        location_name  :  "string",
        opname_id      :  "number",
        detected_at    :  "date",
        is_sync        :  "boolean",
      },
      indexes: [
        { fields: ["opname_id", "location_id"] },
        { fields: "code" },
      ],
    },
  }
}