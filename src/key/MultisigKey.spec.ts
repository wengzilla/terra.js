import { MnemonicKey } from './MnemonicKey';
import { MsgSend, StdSignMsg } from '../core';
import { MultisigKey } from './MultisigKey';

const key1 = new MnemonicKey({
  mnemonic:
    'satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn',
});
const key2 = new MnemonicKey({
  mnemonic:
    'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
});
const key3 = new MnemonicKey({
  mnemonic:
    'quality vacuum heart guard buzz spike sight swarm shove special gym robust assume sudden deposit grid alcohol choice devote leader tilt noodle tide penalty',
});

const send = new MsgSend(
  'terra1zusa5vzpr78lmqkzh78875f00s3en08fuxj4pt',
  'terra1fmcjjt6yc9wqup2r06urnrd928jhrde6gcld6n',
  '1000uluna'
);

describe('MultisigKey', () => {
  it('produces the correct address', () => {
    const msk = new MultisigKey(2, [
      key1.publicKey,
      key2.publicKey,
      key3.publicKey,
    ]);

    expect(msk.accAddress).toEqual(
      'terra1zusa5vzpr78lmqkzh78875f00s3en08fuxj4pt'
    );
  });
});
