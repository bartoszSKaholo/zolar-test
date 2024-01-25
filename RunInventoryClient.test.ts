import { RestfulInventoryClient } from "./RestfulInventoryClient";
import { FileClient, HTTPClient, StockData } from "./types";
import { Mock, vi } from "vitest";

describe("RunInventoryClient", () => {
  let mockHttpClient: HTTPClient;
  let mockFileClient: FileClient;

  const mockStock: StockData[] = [
    { itemCode: "item1", itemId: 1, quantity: 3, status: "AVAILABLE" },
    { itemCode: "item1", itemId: 2, quantity: 5, status: "AVAILABLE" },
    { itemCode: "item2", itemId: 3, quantity: 7, status: "AVAILABLE" },
    { itemCode: "item2", itemId: 4, quantity: 11, status: "AVAILABLE" },
    { itemCode: "item3", itemId: 5, quantity: 13, status: "AVAILABLE" },
    { itemCode: "item4", itemId: 6, quantity: 6, status: "DAMAGED" },
    { itemCode: "item5", itemId: 7, quantity: 7, status: "NEEDS_INSPECTION" },
    { itemCode: "item6", itemId: 8, quantity: 8, status: "WITHHOLD" },
  ];

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn().mockResolvedValue(undefined),
      post: vi.fn().mockResolvedValue(undefined),
    };
    mockFileClient = {
      saveFile: vi.fn().mockResolvedValue(true),
      readFile: vi.fn().mockResolvedValue(true),
      deleteFile: vi.fn().mockResolvedValue(true),
    };
  });
  function getSystemUnderTest() {
    return new RestfulInventoryClient(mockHttpClient, mockFileClient);
  }
  describe("getCurrentStock", () => {
    test("returns the list of available stock", async () => {
      const sut = getSystemUnderTest();
      (mockHttpClient.get as unknown as Mock).mockResolvedValue(mockStock);
      const expetedStock = { 
        item1: 8,
        item2: 18,
        item3: 13,
        item4: 6,
        item5: 7,
        item6: 8
      }
      const aaa = await sut.getCurrentStock();
      console.log(aaa);
      expect(await sut.getCurrentStock()).toEqual(expetedStock);
      expect(mockHttpClient.get).toHaveBeenCalledWith("/stock");
    });

    /**
     * @remarks The dev team has no idea how to deal with damaged stock yet. An implemented test that would be truth would help them figure out how to develop it
     */
    // test.todo("Gets the damaged stock");
    test("Gets the damaged stock", async () => {
      const sut = getSystemUnderTest();
      (mockHttpClient.get as unknown as Mock).mockResolvedValue(mockStock);
      // const expetedStock = {
      //   item1: 8,
      //   item2: 18,
      //   item3: 13,
      // };
      // expect(await sut.getCurrentStock()).toEqual(expetedStock);
      // expect(mockHttpClient.get).toHaveBeenCalledWith("/stock");
    });
  });

  /**
   * @remarks the dev team has no idea how to test this yet. We worked without tests for so long and we know it only works 90% of the time. Both systems are brittle and if something fails we often manually fix it. How can we improve our quality
   */
  describe.todo("receiveInventoryIntoTheWarehouse");
});
