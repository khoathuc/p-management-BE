export class DTC{
	/**
	 * @desc get next date time from current date in hours
	 * @param hours 
	 * @returns 
	 */
	static nextHours(hours: number){
		var time = new Date();
        time.setHours(time.getHours() + hours);

		return time;
	}
	
	
	/**
	 * @desc get next date time from current date in hours
	 * @param days 
	 * @returns 
	 */
	static nextDays(days: number){
		var time = new Date();
		time.setDate(time.getDate() + days);
		return time;
	}
}