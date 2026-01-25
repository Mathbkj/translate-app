import TranslateForm from "./translate-form";

function TranslateApp() {
  return (
    <div className="w-full h-full p-2.5">
      <section className="p-2.5 flex flex-col justify-start items-center space-x-3">
        <TranslateForm />
      </section>
    </div>
  );
}

export default TranslateApp;
