import TranslateForm from "./translate-form";
import Logo from "/logo.svg";

function TranslateApp() {
  return (
    <div className="w-full h-fit p-2.5">
      <section className="p-2.5 flex flex-col items-center space-x-3">
        <img src={Logo} alt="Logo" className="mx-auto mt-20 mb-20" />
        <TranslateForm />
      </section>
    </div>
  );
}

export default TranslateApp;
