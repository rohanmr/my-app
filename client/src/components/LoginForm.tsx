import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useUserStore from "../store/userStore";

interface FormData {
  username: string;
  password: string;
}
const LoginForm = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const onSubmitForm = async (data: FormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        data
      );

      if (response.status === 200) {
        toast.success("User Login successfully");
        setUser(response.data);

        navigate("/profile");
      } else {
        toast.error(response.data);
      }

      reset();
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Internal Server Error, Something went wrong");
      }
    }
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-20 dark">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl text-center font-bold text-gray-200 mb-4">
            Login
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmitForm)}>
            <input
              {...register("username", { required: true })}
              placeholder="User Name"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4  focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            />

            <input
              {...register("password", { required: true })}
              placeholder="Password"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2  focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
            />

            <div className="flex items-center justify-between flex-wrap mt-3">
              <p className="text-white ">
                Don't have an account?{" "}
                <Link
                  className="text-sm text-blue-500 -200 hover:underline mt-4"
                  to="/register"
                >
                  Signup
                </Link>
              </p>
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 mt-5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 cursor-pointer active:scale-[0.98] "
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
