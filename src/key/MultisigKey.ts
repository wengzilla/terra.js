import SHA256 from 'crypto-js/sha256';
import * as HEX from 'crypto-js/enc-hex';
import * as bech32 from 'bech32';
import { PublicKey, StdSignature, StdSignMsg, StdTx } from '../core';
import { Amino, Type, Codec } from '@chainapsis/ts-amino';
const { Concrete, DefineStruct, DefineType, Field } = Amino;
import { addressFromPublicKey, pubKeyFromPublicKey } from './Key';

@Concrete('tendermint/PubKeySecp256k1')
@DefineType()
class PubKey {
  @Field.Array(0, { type: Type.Uint8 })
  public pubkey: Buffer;

  constructor(pubkey: Buffer) {
    this.pubkey = pubkey;
  }
}

@Concrete('tendermint/PubKeyMultisigThreshold')
@DefineStruct()
class MultisigPublicKey {
  @Field.Uint(0, {
    jsonName: 'threshold',
  })
  public threshold: number;

  @Field.Array(1, {
    type: Type.Defined,
  })
  public pubkeys: PubKey[];

  constructor(threshold: number, pubkeys: PubKey[]) {
    this.threshold = threshold;
    this.pubkeys = pubkeys;
  }
}

const codec = new Codec();
codec.registerConcrete('tendermint/PubKeySecp256k1', PubKey.prototype);
codec.registerConcrete(
  'tendermint/PubKeyMultisigThreshold',
  MultisigPublicKey.prototype
);

export class MultisigKey {
  public accAddress: string;

  constructor(public threshold: number, public pubkeys: Buffer[]) {
    const pubkey = new MultisigPublicKey(
      threshold,
      pubkeys.map(pk => new PubKey(pk))
    );

    const bytes = Buffer.from(codec.marshalBinaryBare(pubkey));
    const message = HEX.parse(bytes.toString('hex'));
    const hash = Buffer.from(SHA256(message).toString(), 'hex').slice(0, 20);
    this.accAddress = bech32.encode('terra', Array.from(bech32.toWords(hash)));
  }
}
