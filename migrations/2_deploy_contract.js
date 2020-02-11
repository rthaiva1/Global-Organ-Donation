const patient = artifacts.require("patient");

module.exports = function(deployer) {
  deployer.deploy(patient);
};
