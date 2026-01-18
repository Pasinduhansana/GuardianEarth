import { cn } from "../../lib/utils";
import profile_pic from "../../assets/Profile_Pic.jpg";
import toast from "react-hot-toast";

const getSeverityColor = (level) => {
  switch (level) {
    case "Low":
      return "text-green-600";
    case "Medium":
      return "text-yellow-500";
    case "High":
      return "text-orange-500";
    case "Critical":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export const BentoGrid = ({ className, children }) => {
  return <div className={cn("mx-auto grid grid-cols-1 gap-5 md:auto md:grid-cols-3", className)}>{children}</div>;
};

export const BentoGridItem = ({ className, title, description, header, icon, data, type, navigation, approveDisaster, rejectDisaster }) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between  rounded-xl border border-neutral-200 bg-white transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none relative overflow-hidden",
        className,
        type === "admin" ? "h-[560px]" : "h-[470px]" // <-- Change this value to your desired card height
      )}
      style={{
        backgroundImage: `url(${icon})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black/60 via-black/40 to-black/5 rounded-lg"></div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[60%] backdrop-blur-xl rounded-lg"
        style={{
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)",
        }}
      ></div>
      <div className="relative z-10 transition duration-200 group-hover/bento:border-green-400 border-1 flex flex-col justify-between h-full">
        <div className="flex flex-col h-[60%] text-left items-end">
          <div
            className={`flex h-[22px] w-24 mt-5 mx-5  rounded px-5 justify-center items-center text-center backdrop-blur-md bg-white/20 border border-white/30 shadow-lg`}
          >
            <div className={`text-[13px] font-sans font-medium  text-white`}>{data.severityLevel}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-grow h-[40%]">
          <div className="flex flex-col justify-center ">
            <div className="flex justify-between my-2 mx-5">
              <div className="font-sans text-2xl font-bold text-white">{title}</div>
            </div>

            <div className="font-sans mx-6 pt-2 h-full min-h-[50px] text-left text-[12px] font-normal text-white leading-relaxed">
              {description.length > 130 ? (
                <>
                  {description.slice(0, 130)}...
                  <button
                    className="ml-2 py-1 text-xs text-emerald-300 font-semibold  transition"
                    onClick={() => {
                      toast(
                        <div className="flex flex-col gap-2 max-w-md">
                          <div className="font-bold text-sm text-gray-900">Full Description</div>
                          <div className="text-sm text-gray-700 leading-relaxed">{description}</div>
                        </div>,
                        {
                          duration: 6000,
                          style: {
                            maxWidth: "500px",
                            padding: "16px",
                          },
                          icon: "📖",
                        }
                      );
                    }}
                  >
                    Read More
                  </button>
                </>
              ) : (
                description
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col">
            <div className="border-t border-white/30 my-2 mx-5" />
            <div className="flex flex-row rounded-md justify-between mx-5 mt-2 ">
              <div className="flex gap-3 items-center ">
                <img
                  src={data.userImage || profile_pic} // fallback to default if not available
                  alt="User Profile"
                  className="rounded-full w-[30px] h-[30px] object-cover"
                />
                <div className="flex flex-col text-left text-[12px] font-normal text-white/80">
                  <span className="font-semibold text-[13px] text-white">{data.user || "UnKnown"}</span>
                  <span>{data.email || "Anonymous User"}</span>
                </div>
              </div>
              <div className="flex flex-col text-right text-[12px] font-normal text-white/80">
                <div className="font-semibold text-white">Date</div>
                <span>{data.date ? new Date(data.date).toISOString().split("T")[0] : ""}</span>{" "}
              </div>
            </div>

            {type === "admin" && (
              <>
                <div className="border-t  border-white/30 my-2 mx-5" />
                {data.status === "Pending" ? (
                  <div className="flex gap-2 text-left w-full justify-end pr-4 text-[13px] mt-1">
                    <button
                      onClick={() => approveDisaster(data._id)}
                      className="px-3  border h-[28px] border-green-400 font-medium text-black bg-green-500 rounded-md hover:border-green-400 hover:bg-green-400  transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectDisaster(data._id)}
                      className="px-3  border h-[28px] border-red-400 font-medium text-black bg-red-500 rounded-md hover:bg-red-400  transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex mt-1 items-center text-[12px] h-auto  font-normal text-white/80 ml-5  justify-en">
                    Disaster Post Status : {data.status}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
