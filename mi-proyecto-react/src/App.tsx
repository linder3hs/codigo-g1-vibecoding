import { Button } from "./components/ui/Button";

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

function App() {
  return (
    <main className="m-10">
      <h1>Mi primero proyecto de React</h1>
      <div className="flex gap-5 mt-5">
        <div>
          <Button leftIcon={<PlusIcon />} isLoading={true} variant="danger">
            Mi primer boton
          </Button>
        </div>
        <div>
          <Button rightIcon={<PlusIcon />} variant="info" isDisabled={true}>
            Mi segundo boton
          </Button>
        </div>
        <div>
          <Button variant="warning" isLoading={false}>
            Mi segundo boton
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
