import { FileClient, HTTPClient, Inventory, StockData } from "./types";

/**
 * A client to restfull get inventory data
 */
export class RestfulInventoryClient {
  constructor(
    protected readonly _httpClient: HTTPClient,
    protected readonly _fileClient: FileClient
  ) {}

  /**
   * Gets the current stock
   *
   * @todo receive extra arguments if we want to choose the stock
   */
  public async getCurrentStock(): Promise<Record<string, number>> {
    const response: StockData[] = await this._httpClient.get("/stock");
    return response.reduce<Record<string, number>>((acc, stock) => {
      acc[stock.itemCode] = (acc?.[stock.itemCode] ?? 0) + stock.quantity;
      return acc;
    }, {});
  }

  public async receiveInventoryIntoTheWarehouse(identifier: string) {
    const inventory = await this._httpClient.get<Array<Inventory>>(
      `/orders/${identifier}`
    );
    const fileContents = this._transformStockDataToFile(identifier, inventory);
    await this._fileClient.saveFile(identifier, fileContents);
    /**
     * this changes the number on the order itself
     */
    await this._httpClient.post(`/orders/${identifier}`, {
      status: "AT_THE_WAREHOUSE",
    });
    /**
     * This remove the order as pending
     *
     * @remarks . For no reason of our own this fails 5% of the time. Can we be more resilient?
     */
    await this._httpClient.post(`/orders/${identifier}/flagAsReceived`);

    for (const item of inventory) {
      /**
       * This updates the stock
       *
       * @remarks everybody is unhappy with this 3rd party API, but we have to deal with it
       */
      await this._httpClient.post(`/inventory/${item.itemCode}`, {
        quantity: item.quantity,
        status: item.status,
      });
    }
  }

  protected _transformStockDataToFile(
    __identifier: string,
    __inventory: Array<Inventory>
  ) {
    /**
     * @remarks assume it works
     */
    return "TRANSFORMED_FILE_PRETEND_IT_WORKS";
  }
}
