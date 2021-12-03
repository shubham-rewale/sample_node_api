const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({

	DATE: Date,
	MODE: String,
	LOCATION: String,
	CUSTOMER: String,
	PRODUCT_CODE: String,
	SOURCE: String,
	RAILCAR: String,
	FLEET: String,
	SUBFLEET: String,
	RAILCAR_SEALS: String,
	BOL: String,
	TERMINAL_DESTINATION: String,
	CITY: String,
	STATE: String,
	WEIGHT_IN_KG: Number,
	TEMPERATURE_IN_CELSIUS: Number,
	DENSITY_IN_kg_per_m3_at_15C: Number,
	S_and_W_in_percentage: Number,
	S_and_W_in_BBL_at_15C: Number,
	NET_OIL_in_BBL_at_15C: Number,
	TOTAL_VOL_in_BBL_at_15C: Number,
	S_and_W_in_m3_at15C: Number,
	NET_OIL_in_m3_at_15C: Number,
	TOTAL_VOL_in_m3_at_15C: Number,
	BOL_DATE: Date,
	HEEL_VOLUME_in_m3_at_15C: Number,
	HEEL_WEIGHT_in_kg: Number,
	Contract_Id: Number,
});

const Collection_1 = mongoose.model('collection_1', dataSchema);

module.exports = Collection_1;