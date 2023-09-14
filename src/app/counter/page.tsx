import { revalidatePath } from "next/cache";

let count = 0;

const Home = async () => {
  const increment = async (path: string = "/") => {
    "use server";
    count++;
    revalidatePath(path);
  };

  const decrement = async (path: string = "/") => {
    "use server";
    count--;
    revalidatePath(path);
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      <form className="flex space-x-5">
        <button
          className={incre_button_classes}
          formAction={async () => {
            "use server";
            increment();
          }}
        >
          Increment
        </button>
        <p className="text-center text-2xl font-bold my-4">{count}</p>
        <button
          className={decre_button_classes}
          formAction={async () => {
            "use server";
            decrement();
          }}
        >
          Decrement
        </button>
      </form>
    </div>
  );
};

const incre_button_classes =
  "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded";
const decre_button_classes =
  "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded";

export default Home;
