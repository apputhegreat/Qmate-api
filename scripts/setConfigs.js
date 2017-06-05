var moodsConfig = require('../configs/moods.json');
var CustomRebase = require('../src/common/CustomRebase');
var firebaseUtil = require('../src/utils/firebaseUtil');

setConfigs()
function setConfigs() {
  firebaseUtil.setConfigs('config/moods', moodsConfig)
}
