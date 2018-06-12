class GlobalStateLevelRepository {
  constructor(globalStateLevel) {
    this.globalStateLevel = globalStateLevel;
  }
}

module.exports = {
  createInstance(globalStateLevel) {
    return new GlobalStateLevelRepository(globalStateLevel);
  },
};
