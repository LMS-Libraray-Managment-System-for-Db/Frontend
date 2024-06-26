import FilterInput from "../../../components/FilterInput";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearBook, filterBooks } from "../../../rtk/slices/booksSlice";
import { titleForm } from "../../../components/TitleForm";
import { AllBooks } from "./AllBooks";

export const FilterBook = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [isbn, setISBN] = useState("");
  const [libraryName, setLibraryName] = useState("");

  const books = useSelector((state) => state.books);
  console.log(books);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handlerId = (value) => {
    setId(value);
  };
  const handlerTitle = (value) => {
    setTitle(value);
  };
  const handlerAuthor = (value) => {
    setAuthor(value);
  };
  const handlerISBN = (value) => {
    setISBN(value);
  };
  const handlerType = (value) => {
    setType(value);
  };
  const handlerLibraryName = (value) => {
    setLibraryName(value);
  };

  const setButton = () => {
    let loading = document.querySelector(".loading");
    loading.innerHTML = "filter";
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    console.log({
      id: id,
      title: title,
      author: author,
      isbn: isbn,
      type: type,
      libraryName: libraryName,
    });
    let loading = document.querySelector(".loading");
    let loading_bar = document.createElement("span");
    loading_bar.className = "spinner-border";
    loading_bar.style.height = "1.2rem";
    loading_bar.style.width = "1.2rem";
    loading_bar.style.borderWidth = "0.2rem";
    loading.innerHTML = "";
    loading.appendChild(loading_bar);
    dispatch(clearBook());
    await dispatch(
      filterBooks([1, id, title, author, isbn, type, libraryName])
    );
    setButton();
  };

  const next_page = () => {
    let number;
    if (books?.data?.length > 0) {
      number = books?.page + 1;
      dispatch(clearBook());
      dispatch(
        filterBooks([number, id, title, author, isbn, type, libraryName])
      );
    }
    console.log(number);
  };

  const previous_page = () => {
    let number;
    if (books?.page > 1) {
      number = books?.page - 1;
      dispatch(clearBook());
      dispatch(
        filterBooks([number, id, title, author, isbn, type, libraryName])
      );
    }
    console.log(books?.page);
  };

  useEffect(() => {
    titleForm("Filter Book");
  }, []);

  return (
    <>
      <form onSubmit={handlerSubmit}>
        <FilterInput
          name="id"
          onChange={(value) => handlerId(value)}
          value={id}
        />
        <FilterInput
          name="title"
          onChange={(value) => handlerTitle(value)}
          value={title}
        />
        <FilterInput
          name="author"
          onChange={(value) => handlerAuthor(value)}
          value={author}
        />
        <FilterInput
          name="isbn"
          onChange={(value) => handlerISBN(value)}
          value={isbn}
        />
        <FilterInput
          name="type"
          onChange={(value) => handlerType(value)}
          Radio={true}
          elements={["reference", "fiction", "non-fiction"]}
          value={type}
        />
        <FilterInput
          name="library name"
          onChange={(value) => handlerLibraryName(value)}
          value={libraryName}
        />

        <Button label="filter" />
      </form>
      <AllBooks pagination={false} />
      <div className="pagination">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            previous_page();
          }}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            next_page();
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};
