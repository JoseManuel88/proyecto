import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, newUser } from "../../redux/auth/auth.actions";
import { useForm } from "react-hook-form";
import "../../styles/Formulario.scss";
import { postNewComment } from "../../redux/comment/comment.actions";
import { createPost } from "../../redux/newpost/newpost.actions";

const Formulario = ({ type, postId }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, postCreated, error } = useSelector((state) => state.newPost);

  const [form, setform] = useState(type);
  const [password, setpassword] = useState("");

  const handlePassword = (event) => {
    setpassword(event.target.value);
  };

  const login = (data) => {
    dispatch(loginUser(data, navigate));
  };

  const regist = (data) => {
    dispatch(newUser(data, navigate));
  };

  const [inputFields, setInputFields] = useState([{ name: "", quantity: "" }]);

  const addFields = () => {
    let newfield = { name: "", quantity: "" };
    setInputFields([...inputFields, newfield]);
  };

  const onDelete = (indexToDelete) => {
    const newFields = inputFields.filter((d, index) => index !== indexToDelete);
    setInputFields([...newFields]);
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };

  const comment = (data) => {
    dispatch(postNewComment(data, navigate));
    document.getElementById("commentform").reset();
  };

  const newRecipe = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("text", data.text);
    formData.append("img", data.img[0]);
    formData.append("section", data.section);
    let ingredients = [];
    inputFields.map((input) => {
      ingredients.push(input);
    });
    formData.append("ingredients", JSON.stringify(ingredients));
    dispatch(createPost(formData, navigate));
  };

  return (
    <div className="formulario">
      {form === "login" && (
        <>
          <div className="login--form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(login)}>
              <div className="inputForm">
                <label htmlFor="email">
                  <p>Email</p>
                </label>
                <input
                  id="email"
                  type="text"
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  })}
                />
                {errors.email?.type === "required" && <p>El campo email es requerido</p>}
                {errors.email?.type === "pattern" && <p>El formato del email es incorrecto</p>}
              </div>
              <div className="inputForm">
                <label htmlFor="password">
                  <p>Password</p>
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: true,
                  })}
                />
                {errors.password?.type === "required" && <p>El campo password es requerido</p>}
              </div>

              <input type="submit" value="Enviar" />
              <p className="login--p" onClick={() => setform("regist")}>
                ¿Aún no tienes cuenta? <span>Registrate aquí</span>
              </p>
            </form>
          </div>
        </>
      )}

      {form === "regist" && (
        <>
          <div className="login--form">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit(regist)}>
              <div className="inputForm">
                <label htmlFor="username">
                  <p>Nombre de Usuario</p>
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: true,
                    maxLength: 15,
                  })}
                />
                {errors.username?.type === "required" && <p>El campo Nombre de Usuario es requerido</p>}
                {errors.username?.type === "maxLength" && (
                  <p>El campo Nombre de Usuario debe tener menos de 15 caracteres</p>
                )}
              </div>
              <label htmlFor="email">
                <p>Email</p>
              </label>
              <div className="inputForm">
                <input
                  id="email"
                  type="text"
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  })}
                />
                {errors.email?.type === "required" && <p>El campo Email es requerido</p>}
                {errors.email?.type === "pattern" && <p>El formato del Email es incorrecto</p>}
              </div>
              <label htmlFor="password">
                <p>Password</p>
              </label>
              <div className="inputForm">
                <input
                  id="password"
                  type="password"
                  onInput={(event) => handlePassword(event)}
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 8,
                      message: "Introduce mínimo 8 caracteres",
                    },
                  })}
                />
                {errors.password?.type === "required" && <p>El campo Password es requerido</p>}
                {errors.password && <p>{errors.password.message}</p>}
              </div>
              <label htmlFor="password_repeat">
                <p>Repite el password</p>
              </label>
              <div className="inputForm">
                <input
                  id="password_repeat"
                  type="password"
                  {...register("password_repeat", {
                    required: true,
                    validate: (value) => value === password || "Los password no coinciden",
                  })}
                />
                {errors.password_repeat?.type === "required" && <p>El campo Repetir Password es requerido</p>}
                {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
              </div>

              <input type="submit" value="Enviar" />
            </form>
            <p onClick={() => setform("login")}>
              ¿Ya tienes cuenta de usuario? <span>Click aqui para entrar</span>
            </p>
          </div>
        </>
      )}
      {form === "comment" && (
        <>
          <form id="commentform" onSubmit={handleSubmit(comment)}>
            <input {...register("postId", { value: postId })} type="hidden" />
            <input {...register("author", { value: localStorage.userId })} type="hidden" />
            <input
              type={"text"}
              id="comment"
              placeholder="Introduce aqui tu comentario"
              {...register("text", {
                required: true,
              })}
            ></input>
            <button type="submit">Comenta</button>
          </form>
        </>
      )}
      {form === "newRecipe" && (
        <>
          {isLoading && <h2>Creando post...</h2>}
          {postCreated && <h2>Post creado, se te redirigira al post en unos segundos</h2>}
          {!isLoading && (
            <div className="recipeForm">
              <form id="recipeForm" onSubmit={handleSubmit(newRecipe)}>
                <label>
                  Título
                  <input type={"text"} id="title" {...register("title", { required: true })} />
                </label>
                <label>
                  Subtítulo
                  <input type={"text"} id="subtitle" {...register("subtitle", { required: true })} />
                </label>
                <span>Texto</span>
                <label>
                  <textarea rows="10" id="text" {...register("text", { required: true })} />
                </label>
                <label>
                  Foto
                  <input type={"file"} id="img" {...register("img", { required: true })} />
                </label>
                <span>Ingredientes</span>
                {inputFields.map((input, index) => {
                  return (
                    <div className="ingredient-field" key={index}>
                      <input
                        name="name"
                        placeholder="Ingrediente"
                        value={input.name}
                        onChange={(event) => handleFormChange(index, event)}
                      />
                      <input
                        name="quantity"
                        placeholder="Cantidad"
                        value={input.quantity}
                        onChange={(event) => handleFormChange(index, event)}
                      />
                      <p onClick={() => onDelete(index)}>X</p>
                    </div>
                  );
                })}
                <span className="span--button" onClick={addFields}>
                  Añadir otro...
                </span>
                <label>
                  Categoría
                  <select type={"select"} id="section" {...register("section", { required: true })}>
                    <option value="guiso">Guisos</option>
                    <option value="ensalada">Ensaladas</option>
                    <option value="postre">Postres</option>
                    <option value="cocktail">Cocktails</option>
                    <option value="otro">Otros</option>
                  </select>
                </label>
                <button type="submit">Enviar receta</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Formulario;
