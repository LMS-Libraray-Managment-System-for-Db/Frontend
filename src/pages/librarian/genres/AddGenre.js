import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { titleForm } from "../../../components/TitleForm";
import { useDispatch } from "react-redux";
import { addGenre } from "../../../rtk/slices/genresSlice";

export const AddGenre = () => {
  const [genres, setGenres] = useState([""]);
  const dispatch = useDispatch();

  const handleGenres = (e) => {
    // setGenres(e.target.value);
    let numGenre = e.target.name.split(" ")[1] - 1;
    console.log(numGenre);
    let allGenres = [...genres];
    allGenres[numGenre] = e.target.value;
    console.log(allGenres);
    setGenres(allGenres);
  };
  const increaseGenre = () => {
    let allGenres = [...genres, ""];
    setGenres(allGenres);
  };

  const setButton = () => {
    let loading = document.querySelector(".loading");
    loading.innerHTML = "add";
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    console.log({ names: genres });
    let loading = document.querySelector(".loading");
    let loading_bar = document.createElement("span");
    loading_bar.className = "spinner-border";
    loading_bar.style.height = "1.2rem";
    loading_bar.style.width = "1.2rem";
    loading_bar.style.borderWidth = "0.2rem";
    loading.innerHTML = "";
    loading.appendChild(loading_bar);
    await dispatch(addGenre(genres));
    setButton();
  };

  useEffect(() => {
    titleForm("add genre");
  }, []);
  return (
    <div className="genre_page">
      <form onSubmit={handlerSubmit}>
        {genres?.map((genre, index) => (
          <Input
            key={index}
            type="text"
            name={"genre " + (1 + index)}
            value={genre}
            onChange={(e) => handleGenres(e)}
          />
        ))}
        <div className="field_form">
          <button type="button" className="btn btn-add" onClick={increaseGenre}>
            +
          </button>
        </div>
        <Button label="add" />
      </form>
    </div>
  );
};
