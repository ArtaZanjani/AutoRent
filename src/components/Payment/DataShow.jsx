import { capitalAirports } from "@/utils/utils";
import { SearchContext } from "@/context/SearchProvider";
import { useContext } from "react";
import { TickSquare } from "iconsax-react";

const DataShow = () => {
  const { BookingData } = useContext(SearchContext);
  const findCity = capitalAirports.find((e) => e.code === BookingData?.AirportCode);

  const start = BookingData?.Date?.[0];
  const end = BookingData?.Date?.[1];
  const dataShow = [
    {
      Label: "محل تحویل/بازگشت",
      value: findCity?.city ? `${findCity.city} - ${findCity.airport}` : "نامشخص",
    },
    {
      Label: "تاریخ تحویل",
      value: start ? `${start.jy}/${start.jm}/${start.jd} - ${BookingData?.time?.[0] || ""}` : "نامشخص",
    },
    {
      Label: "خودرو",
      value: BookingData?.carInfo?.carName || "نامشخص",
    },
    {
      Label: "تاریخ بازگشت",
      value: end ? `${end.jy}/${end.jm}/${end.jd} - ${BookingData?.time?.[1] || ""}` : "نامشخص",
    },
    {
      Label: "پوشش",
      value: BookingData?.insuranceOptions?.type || "نامشخص",
    },
  ];
  return (
    <div className="flex flex-row flex-wrap items-start justify-start w-full gap-10">
      {dataShow.map((e, index) => (
        <div className="flex items-center px-2 py-1 border rounded-lg gap-x-2 border-neutral-gray-4" key={index}>
          <TickSquare className="size-6 stroke-neutral-gray-11" />
          <div className="space-y-1">
            <p className="text-sm stroke-neutral-gray-10">{e.Label}</p>
            <p className="text-xs font-medium stroke-neutral-gray-7">{e.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataShow;
