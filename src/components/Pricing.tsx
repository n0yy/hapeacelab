import Link from "next/link";

export default function Pricing(props: {
  title: string;
  list: string[];
  price: string;
}) {
  const { title, list, price } = props;
  return (
    <div className="py-5 px-10 w-[360px] border border-slate-800 rounded-lg flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        <ul className="list-disc text-sm text-slate-600 ml-4 mt-2">
          {list?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <Link
          href="/"
          className="block w-full bg-slate-900 mt-10 text-white text-sm text-center py-1.5 rounded-lg font-light"
        >
          {price}
        </Link>
      </div>
    </div>
  );
}
