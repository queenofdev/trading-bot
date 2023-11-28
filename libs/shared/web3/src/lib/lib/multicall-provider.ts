import { BlockWithTransactions } from "@ethersproject/abstract-provider";
import {
  Block,
  BlockTag,
  EventType,
  Filter,
  Listener,
  Log,
  Network,
  Provider,
  TransactionReceipt,
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/providers";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import { multicallAbi as MulticallContract } from "../abi";
import { DebugHelper } from "../helpers/debug-helper";

interface Request {
  transaction: Deferrable<TransactionRequest>;
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}

export class MulticallProvider extends Provider {
  private readonly disabled: boolean;
  private readonly networkName: string;
  private readonly provider: Provider;
  private readonly multicallContract: ethers.Contract;
  private requestQueue: Request[] | null;

  constructor(networkName: string, provider: Provider, multicallAddress: string) {
    super();
    this.disabled = DebugHelper.isActive("disable-multicall");
    this.networkName = networkName;
    this.provider = provider;
    this.multicallContract = new ethers.Contract(
      multicallAddress,
      MulticallContract,
      provider
    );
    this.requestQueue = null;
  }

  private flushQueue(): void {
    if (this.requestQueue == null || this.requestQueue.length === 0) {
      console.error("Did not expect empty requestQueue");
    } else {
      const toFlush = this.requestQueue;
      this.requestQueue = null;
      console.debug(`${this.networkName}: Requests to flush: ${toFlush.length}`);
      const aggregatedRequest = toFlush
        .map((request) => request.transaction)
        .map((transaction) => [transaction.to, transaction.data]);
      const resolves = toFlush.map((request) => request.resolve);
      const rejects = toFlush.map((request) => request.reject);
      this.multicallContract["tryAggregate"](false, aggregatedRequest).then(
        (results: any) => {
          for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.success) {
              resolves[i](result.returnData);
            } else {
              rejects[i](result.returnData);
            }
          }
        }
      );
    }
  }

  call(
    transaction: ethers.utils.Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.disabled
      ? this.provider.call(transaction, blockTag)
      : new Promise((resolve, reject) => {
          const request = { transaction, resolve, reject };
          if (this.requestQueue == null) {
            this.requestQueue = [request];
            setTimeout(() => this.flushQueue(), 1);
          } else {
            this.requestQueue.push(request);
          }
        });
  }

  getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }
  getNetwork(): Promise<Network> {
    return this.provider.getNetwork();
  }
  getGasPrice(): Promise<BigNumber> {
    return this.provider.getGasPrice();
  }
  getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<BigNumber> {
    return this.provider.getBalance(addressOrName, blockTag);
  }
  getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    return this.provider.getTransactionCount(addressOrName, blockTag);
  }
  getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.provider.getCode(addressOrName, blockTag);
  }
  getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.provider.getStorageAt(addressOrName, position, blockTag);
  }
  sendTransaction(
    signedTransaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    return this.provider.sendTransaction(signedTransaction);
  }
  estimateGas(
    transaction: ethers.utils.Deferrable<TransactionRequest>
  ): Promise<BigNumber> {
    return this.provider.estimateGas(transaction);
  }
  getBlock(blockHashOrBlockTag: BlockTag | Promise<BlockTag>): Promise<Block> {
    return this.provider.getBlock(blockHashOrBlockTag);
  }
  getBlockWithTransactions(
    blockHashOrBlockTag: BlockTag | Promise<BlockTag>
  ): Promise<BlockWithTransactions> {
    return this.provider.getBlockWithTransactions(blockHashOrBlockTag);
  }
  getTransaction(transactionHash: string): Promise<TransactionResponse> {
    return this.provider.getTransaction(transactionHash);
  }
  getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt> {
    return this.provider.getTransactionReceipt(transactionHash);
  }
  getLogs(filter: Filter): Promise<Log[]> {
    return this.provider.getLogs(filter);
  }
  resolveName(name: string | Promise<string>): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.provider.resolveName(name);
  }
  lookupAddress(address: string | Promise<string>): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.provider.lookupAddress(address);
  }
  on(eventName: EventType, listener: Listener): Provider {
    return this.provider.on(eventName, listener);
  }
  once(eventName: EventType, listener: Listener): Provider {
    return this.provider.once(eventName, listener);
  }
  emit(eventName: EventType, ...args: any[]): boolean {
    return this.provider.emit(eventName, args);
  }
  listenerCount(eventName?: EventType): number {
    return this.provider.listenerCount(eventName);
  }
  listeners(eventName?: EventType): Listener[] {
    return this.provider.listeners(eventName);
  }
  off(eventName: EventType, listener?: Listener): Provider {
    return this.provider.off(eventName, listener);
  }
  removeAllListeners(eventName?: EventType): Provider {
    return this.provider.removeAllListeners(eventName);
  }
  waitForTransaction(
    transactionHash: string,
    confirmations?: number,
    timeout?: number
  ): Promise<TransactionReceipt> {
    return this.provider.waitForTransaction(transactionHash, confirmations, timeout);
  }
}
