/**
 * 
 */
package com.phonegap.wifiplugin;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.util.Log;


import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import com.phonegap.api.PluginResult.Status;

/**
 * @author iverds
 *
 */
public class GetBssidPlugin extends Plugin {

	/* (non-Javadoc)
	 * @see com.phonegap.api.Plugin#execute(java.lang.String, org.json.JSONArray, java.lang.String)
	 */
	@Override
	public PluginResult execute(String arg0, JSONArray data, String callbackId) {
		Log.d("BssidPlugin", "Plugin called");
		WifiManager wm = (WifiManager) ctx.getSystemService(Context.WIFI_SERVICE);
		wm.startScan();
		List<ScanResult> list = wm.getScanResults();
		JSONObject wifiInfo = new JSONObject();
		JSONArray ary = new JSONArray();
		for (ScanResult scanResult : list) {
			Log.d("BssidPlugin", "Wifi found!");
			JSONObject obj = new JSONObject();
			try {
				obj.put("id", 1);
				obj.put("bssid", scanResult.BSSID);
				obj.put("signalStrength", scanResult.level);
				obj.put("sampleId", Math.round(Math.random()*10));
			} catch (JSONException e) {
				Log.d("BssidPlugin", "Got exception in obj.put");
			}
			ary.put(obj);
		}
		PluginResult result = null;
		try {
			wifiInfo.put("wifiList", ary);
			result = new PluginResult(Status.OK, wifiInfo);
		} catch (JSONException e) {
			Log.d("BssidPlugin", "Got exception wifiInfo.put");
			result = new PluginResult(Status.JSON_EXCEPTION);
		}
		return result;
	}

}
