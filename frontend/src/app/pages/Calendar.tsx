import {
    Calendar as BigCalendar,
    CalendarProps,
    momentLocalizer,
} from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

type OmitCalendarProps = Omit<CalendarProps, "localizer">;

export default function Calendar(props: OmitCalendarProps) {
    return <BigCalendar {...props} localizer={localizer} />;
}
