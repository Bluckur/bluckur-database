function addState(accumelator, publicKey, type, amount, isRecipient) {
  /* eslint-disable no-param-reassign */
  const multiplier = isRecipient ? 1 : -1;
  if (accumelator[publicKey]) {
    accumelator[publicKey][type] += amount * multiplier;
  } else {
    accumelator[publicKey] = {
      coin: type === 'coin' ? amount * multiplier : 0,
      stake: type === 'stake' ? amount * multiplier : 0,
    };
  }
  /* eslint-enable no-param-reassign */
}

module.exports = {
  convertToStates(transactions) {
    return transactions.reduce((accumelator, {
      recipient, sender, amount, type,
    }) => {
      addState(accumelator, recipient, type, amount, true);
      addState(accumelator, sender, type, amount);
      return accumelator;
    });
  },
};
