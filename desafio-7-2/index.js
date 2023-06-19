import express from "express";
import path from "path";
import { nanoid } from "nanoid";
import { writeFile, readFile } from "node:fs/promises";

const app = express();
app.use(express.json());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciando en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.get("/canciones", async (req, res) => {
  const fsResponse = await readFile("canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);
  res.json(canciones);
});

app.get("/canciones/:id", async (req, res) => {
  const id = req.params.id;

  const fsResponse = await readFile("canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);

  const cancion = canciones.find((cancion) => cancion.id == id);
  console.log("Valor de cancion al buscar: ", cancion);

  if (!cancion) res.status(404).json({ message: "cancion with ID not found" });
  res.json(cancion);
});

app.post("/canciones", async (req, res) => {
  const { cancion, artista, tono } = req.body;

  const newTodo = {
    id: nanoid(),
    cancion,
    artista,
    tono,
  };

  const fsResponse = await readFile("canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);
  canciones.push(newTodo);

  await writeFile("canciones.json", JSON.stringify(canciones));
  res.status(201).json({ ok: true, msg: "Cancion created", cancion: newTodo });
});

app.put("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { cancion, artista, tono } = req.body;
  console.log({ cancion, artista, tono });

  if (!cancion || !artista || !tono)
    return res
      .status(400)
      .json({ ok: false, msg: "cancion and artista are required" });

  const fsResponse = await readFile("canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);

  const newTodos = canciones.map((cancion) => {
    if (cancion.id === id) {
      return {
        ...cancion,
        cancion,
        artista,
        tono,
      };
    }
    return cancion;
  });

  console.log(newTodos);
  await writeFile("canciones.json", JSON.stringify(newTodos));
  res.status(200).json({ ok: true, msg: "Cancion updated" });
});

app.delete("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  const fsResponse = await readFile("canciones.json", "utf-8");
  const canciones = JSON.parse(fsResponse);
  const newTodos = canciones.filter((cancion) => cancion.id !== id);
  await writeFile("canciones.json", JSON.stringify(newTodos));
  res.status(200).json({ ok: true, msg: "Cancion deleted" });
});
