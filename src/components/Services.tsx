import Image from "next/image";
import Link from "next/link";

export default function Services({ ...props }: any) {
  if (props.isUpcoming) {
    return (
      <div className="flex items-center justify-evenly w-[450px] h-[156px] bg-primary shadow-neo rounded-xl scale-100 md:scale-90 mt-7 text-lg text-slate-800 font-semibold">
        Up Coming!
      </div>
    );
  }
  return (
    <div className="flex items-center justify-evenly w-[450px] h-[156px] bg-primary shadow-neo rounded-xl scale-100 md:scale-90 mt-7">
      <Image
        src={props.urlIcon}
        width={props.width ? props.width : 56}
        height={props.height ? props.height : 56}
        alt="icon"
      />
      <div className="w-8/12">
        <h4 className="text-lg md:text-xl font-semibold">{props.title}</h4>
        <p className="text-xs md:text-sm mb-2">{props.desc}</p>
        <Link
          href={props.url}
          className="text-sm md:text-base font-semibold underline "
        >
          Try it!
        </Link>
      </div>
    </div>
  );
}
