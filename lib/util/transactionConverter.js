const Models = require('bluckur-models');

/**
 * [addPendingStateToStates description]
 * @param {State[]}  states      [description]
 * @param {String}  publicKey   [description]
 * @param {String}  type        [description]
 * @param {Float}  amount      [description]
 * @param {Boolean} isRecipient [description]
 */
function addPendingStateToStates(states, publicKey, type, amount, isRecipient) {
  const multiplier = isRecipient ? 1 : -1;
  const state = states.find(s => s.publicKey === publicKey);
  if (state) {
    state[type] += amount * multiplier;
  } else {
    states.push(Models.createStateInstance({
      publicKey,
      coin: type === 'coin' ? amount * multiplier : 0,
      stake: type === 'stake' ? amount * multiplier : 0,
    }));
  }
}

module.exports = {
  /**
   * [convertToStates description]
   * @param  {Transaction[]} transactions [description]
   * @return {State[]}              [description]
   */
  convertToStates(transactions) {
    const states = [];
    transactions.forEach(({
      recipient, sender, type, amount,
    }) => {
      addPendingStateToStates(states, recipient, type, amount, true);
      addPendingStateToStates(states, sender, type, amount);
    });
    return states;
  },
};
