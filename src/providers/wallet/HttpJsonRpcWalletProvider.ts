import { Message, SignedMessage, Signature, Cid, MessagePartial } from '../Types';
import { WalletProvider } from './WalletProvider';
import { HttpJsonRpcConnector, JsonRpcConnectionOptions } from '../../connectors/HttpJsonRpcConnector';
import { toBase64 } from '../../utils/data';
import BigNumber from 'bignumber.js';
import { Connector } from '../../connectors/Connector';

export class HttpJsonRpcWalletProvider implements WalletProvider {

  private conn: Connector;

  constructor(connector: Connector) {
    this.conn = connector;
    this.conn.connect();
  }

  public async release() {
    return this.conn.disconnect();
  }

  /**
   * create new wallet
   * @param type
   */
  public async newAccount(type = 1): Promise<string[]> {
    const ret = await this.conn.request({ method: 'Filecoin.WalletNew', params: [type] });
    return ret as string[];
  }

  /**
   * get nonce for address
   * @param address
   */
  public async getNonce(address: string): Promise<number> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolGetNonce', params: [address] });
    return ret as number;
  }

  /**
   * get wallet list
   */
  public async getAccounts(): Promise<string[]> {
    const ret = await this.conn.request({ method: 'Filecoin.WalletList' });
    return ret as string[];
  }

  /**
   * get balance for address
   * @param address
   */
  public async getBalance(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.WalletBalance', params: [address] });
    return ret as string;
  }

  public async setDefaultAccount(address: string): Promise<undefined> {
    const ret = await this.conn.request({ method: 'Filecoin.WalletSetDefault', params: [address] });
    return ret as undefined;
  }

  /**
   * get default address
   */
  public async getDefaultAccount(): Promise<string> {
    const ret = await this.conn.request({ method: 'Filecoin.WalletDefaultAddress' });
    return ret as string;
  }

  /**
   * send message, signed with default lotus wallet
   * @param msg
   */
  public async sendMessage(msg: Message): Promise<SignedMessage> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolPushMessage', params: [msg, { MaxFee: "30000000000000" }] });
    return ret as SignedMessage;
  }

  /**
   * send signed message
   * @param msg
   */
  public async sendSignedMessage(msg: SignedMessage): Promise<Cid> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolPush', params: [msg] });
    return ret as Cid;
  }

  /**
   * estimate gas to succesufully send message, and have it included in the next 10 blocks
   * @param msg
   */
  public async estimateMessageGas(message: Message): Promise<Message> {
    const ret = await this.conn.request({ method: 'Filecoin.GasEstimateMessageGas', params: [message, { MaxFee: "30000000000000" }, []] });
    return ret as Message;
  }

  /**
   * prepare a message for signing, add defaults, and populate nonce and gas related parameters if not provided
   * @param msg
   */
  public async createMessage(message: MessagePartial): Promise<Message> {
    let msg: Message = {
      To: message.To,
      From: message.From,
      Value: message.Value ? message.Value : new BigNumber(0),
      GasLimit: message.GasLimit ? message.GasLimit : 0,
      GasFeeCap: message.GasFeeCap ? message.GasFeeCap : new BigNumber(0),
      GasPremium: message.GasPremium ? message.GasPremium : new BigNumber(0),
      Method: message.Method ? message.Method : 0,
      Params: message.Params ? message.Params : '',
      Version: message.Version ? message.Version : 0,
      Nonce: message.Nonce ? message.Nonce : await this.getNonce(message.From),
    }

    if (msg.GasLimit === 0) msg = await this.estimateMessageGas(msg);

    return msg;
  }

  //Signer methods
  /**
   * sign message
   * @param msg
   */
  public async signMessage(msg: Message): Promise<SignedMessage> {
    const address = await this.getDefaultAccount();
    const ret = await this.conn.request({ method: 'Filecoin.WalletSignMessage', params: [address, msg] });
    return ret as SignedMessage;
  }

  /**
   * sign raw message
   * @param data
   */
  public async sign(data: string | ArrayBuffer): Promise<Signature> {
    const address = await this.getDefaultAccount();
    data = toBase64(data);
    const ret = await this.conn.request({ method: 'Filecoin.WalletSign', params: [address, data] });
    return ret as Signature;
  }

  /**
   * verify message signature
   * @param data
   * @param sign
   */
  public async verify(data: string | ArrayBuffer, sign: Signature): Promise<boolean> {
    const address = await this.getDefaultAccount();
    data = toBase64(data);
    const ret = await this.conn.request({ method: 'Filecoin.WalletVerify', params: [address, data, sign] });
    return ret as boolean;
  }

  //Payment channel methods
  /*
	PaychNewPayment(ctx context.Context, from, to address.Address, vouchers []VoucherSpec) (*PaymentInfo, error)
  */

  public async getPaymentChannel(from: string, to: string, amount: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychGet', params: [from, to, amount] });
    return ret;
  }

  public async getWaitReadyPaymentChannel(cid: Cid): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychGetWaitReady', params: [cid] });
    return ret;
  }

  public async getPaymentChannelList(): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychList', params: [] });
    return ret;
  }

  public async getPaymentChannelStatus(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychStatus', params: [address] });
    return ret;
  }

  public async PaymentChannelAllocateLane(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychAllocateLane', params: [address] });
    return ret;
  }

  public async PaymentChannelSettle(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychSettle', params: [address] });
    return ret;
  }

  public async PaymentChannelCollect(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychCollect', params: [address] });
    return ret;
  }

  //Payment channel vouchers methods
  public async PaymentChannelVoucherCreate(address: string, amount: string, lane: number): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherCreate', params: [address, amount, lane] });
    return ret;
  }

  public async PaymentChannelVoucherList(address: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherList', params: [address] });
    return ret;
  }

  public async PaymentChannelVoucherCheckValid(address: string, signedVoucher: any): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherCheckValid', params: [address, signedVoucher] });
    return ret;
  }

  public async PaymentChannelVoucherAdd(address: string, signedVoucher: any, proof: any, minDelta: string): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherAdd', params: [address, signedVoucher, proof, minDelta] });
    return ret;
  }

  public async PaymentChannelVoucherCheckSpendable(address: string, signedVoucher: any, secret: any, proof: any): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherCheckSpendable', params: [address, signedVoucher, secret, proof] });
    return ret;
  }

  public async PaymentChannelVoucherVoucherSubmit(address: string, signedVoucher: any, secret: any, proof: any): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.PaychVoucherSubmit', params: [address, signedVoucher, secret, proof] });
    return ret;
  }
}