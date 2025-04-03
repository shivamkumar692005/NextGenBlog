export default function Home({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-4 bg-black">
        <div className="col-span-1 md:col-span-2">{left}</div>
        <div className="hidden md:block col-span-1">{right}</div>
      </div>
    );
}
  