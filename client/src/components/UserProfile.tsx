import { useForm } from "react-hook-form";
import useUserStore from "../store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UploadForm {
  file: FileList;
}

interface DownloadForm {
  code: string;
}

interface File {
  _id: string;
  filename: string;
  filecode: string;
}

const UserProfile = () => {
  const { user } = useUserStore();
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<Blob | null>(null);
  const [userFiles, setUserFiles] = useState<File[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDownlaodFile, setCurrentDownloadFile] = useState<File | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(
          "http://localhost:3000/api/user/userfiles?username=" + user?.username
        )
        .then((res) => setUserFiles(res.data));
    } else {
      navigate("/");
    }
  }, [user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFileName(file.name);
      setCurrentFile(file);
    }
  };

  const uploadForm = useForm<UploadForm>();
  const onFileUploadFormSubmit = async () => {
    try {
      const formData = new FormData();
      const fileOfBlob = new File([currentFile as Blob], currentFileName);
      formData.append("file", fileOfBlob);
      formData.append("username", user?.username);

      const response = await axios.post(
        "http://localhost:3000/api/user/uploadfile",
        formData
      );

      if (response.status === 200) {
        toast.success("File Uplaoded successfully");
        setCurrentFile(null);
        setCurrentFileName("");
        setUserFiles([...userFiles, response.data]);
        // setUser(response.data);
      } else {
        toast.error(response.data);
      }

      uploadForm.reset();
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Internal Server Error, Something went wrong");
      }
    }
  };

  const downloadForm = useForm<DownloadForm>();
  const onDownloadFormSubmit = async (data: DownloadForm) => {
    if (data.code === currentDownlaodFile?.filecode) {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/downloadfile?fileId=" +
            currentDownlaodFile._id
        );
        if (response.status === 200) {
          const type = response.headers["content-type"];
          const blob = new Blob([response.data], { type: type });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = currentDownlaodFile.filename;
          link.click();
          toast.success("File downloaded successfully");

          setCurrentDownloadFile(null);
          setShowPopup(false);
        } else {
          toast.error(response.data);
        }
      } catch (error: any) {
        if (error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Internal Server Error, Something went wrong");
        }
      }
    } else {
      toast.error("Invalid code.");
    }
  };

  const handelDelete = async (fileId: string) => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/api/user/deletefile?fileId=" + fileId
      );
      if (response.status === 200) {
        toast.success("File deleted successfully");
        setUserFiles([...userFiles.filter((file) => file._id !== fileId)]);
      } else {
        toast.error(response.data);
      }
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Internal Server Error, Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="text-2xl text-center mb-5">User Profile</div>
      <div className="text-xl text-center mb-5">
        Welcome {user?.firstname} {user?.lastname}
      </div>
      <form onSubmit={uploadForm.handleSubmit(onFileUploadFormSubmit)}>
        <div className="justify-center text-center items-center flex w-full mb-5">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-1/2 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              {...uploadForm.register("file")}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div>
            <button
              type="submit"
              disabled={!currentFile}
              className="ml-5 px-3 py-1 border cursor-pointer border-blue-500 rounded hover:bg-blue-500"
            >
              Upload
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto justify-center text-center items-center flex bg-white dark:bg-neutral-700">
        <table className="  text-sm whitespace-nowrap w-1/2">
          <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-t">
            <tr>
              <th
                scope="col"
                className="px-6 py-2 border-x dark:border-neutral-600"
              >
                File Name
              </th>
              <th
                scope="col"
                className="px-6 py-2 border-x dark:border-neutral-600"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {userFiles.map((file) => (
              <tr key={file._id} className="border-b dark:border-neutral-600">
                <th
                  scope="row"
                  className="px-6 py-2 border-x dark:border-neutral-600"
                >
                  {file.filename}
                </th>
                <td className="px-6 py-2 border-x dark:border-neutral-600 flex">
                  <button
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    className="block mr-2 px-2 py-1 border cursor-pointer border-blue-500 rounded hover:bg-blue-500"
                    type="button"
                    onClick={() => {
                      setShowPopup(true);
                      setCurrentDownloadFile(file);
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handelDelete(file._id)}
                    className="mr-2 px-2 py-1 border cursor-pointer border-red-500 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showPopup && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Download File</h2>
              <form onSubmit={downloadForm.handleSubmit(onDownloadFormSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter Six-Digit Code {currentDownlaodFile?.filecode}
                  </label>
                  <input
                    id="code"
                    {...downloadForm.register("code")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Code"
                  />
                </div>
                <div className="flex justify-center gap-2 ">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
