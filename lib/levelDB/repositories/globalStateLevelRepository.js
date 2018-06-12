class GlobalStateLevelRepository {
  constructor(globalStateLevel) {
    this.globalStateLevel = globalStateLevel;
  }
}

module.exports = {
  createInstance(globalStateLevel) {
    if (!globalStateLevel) {
      throw new Error('Invalid argument(s)');
    }
    return new GlobalStateLevelRepository(globalStateLevel);
  },
};
