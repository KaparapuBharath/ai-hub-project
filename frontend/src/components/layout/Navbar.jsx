function Navbar({ title }) {
  return (
    <div className="h-16 border-b border-white/10 flex items-center px-8">

      <div className="flex items-center w-full">

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-white">
          {title}
        </h1>

      </div>

    </div>
  );
}

export default Navbar;