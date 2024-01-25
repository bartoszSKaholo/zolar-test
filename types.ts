export interface StockData {
  itemCode: string;
  itemId: number;
  quantity: number;
  status: "AVAILABLE" | "DAMAGED" | "NEEDS_INSPECTION" | "WITHHOLD";
}

export type Inventory = Pick<StockData, "quantity" | "itemCode" | "status">;

export interface HTTPClient {
  get<T = unknown>(url: string): Promise<T>;
  post<T = unknown>(url: string, body?: Record<string, unknown>): Promise<T>;
}

export interface FileClient {
  saveFile(fileName: string, content: string): Promise<boolean>;
  readFile(fileName: string): Promise<boolean>;
  deleteFile(fileName: string): Promise<boolean>;
}
