export default class Utils {

    public static computeEllapsedTime(startTime: Date, endTime: Date): number {
        let timeDiff: number = endTime.getTime() - startTime.getTime(); //in ms
        timeDiff /= 1000; // strip the ms
        //return Math.round(timeDiff); // get seconds 
        return timeDiff;
    }

}