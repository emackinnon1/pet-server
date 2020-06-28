import express from "express";
import cors from "cors";
const app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// app.get("/", (request, response) => {
// 	response.send("Oh hey Pet Box");
// });

app.listen(app.get("port"), () => {
	console.log(
		`${app.locals.title} is running on http://localhost:${app.get("port")}.`
	);
});

app.locals.title = "Pet Box";
app.locals.pets = [
	{ id: "a1", name: "Rover", type: "dog" },
	{ id: "b2", name: "Marcus Aurelius", type: "parakeet" },
	{ id: "c3", name: "Craisins", type: "cat" },
];

app.get("/api/v1/pets", (request, response) => {
	const pets = app.locals.pets;

	response.json({ pets });
});

app.get("/api/v1/pets/:id", (request, response) => {
	const { id } = request.params;
	const pet = app.locals.pets.find((pet) => pet.id === id);
	if (!pet) {
		return response.sendStatus(404);
	}

	response.status(200).json(pet);
});

app.post("/api/v1/pets", (request, response) => {
	const id = Date.now();
	const pet = request.body;

	for (let requiredParameter of ["name", "type"]) {
		if (!pet[requiredParameter]) {
			return response.status(422).send({
				error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.`,
			});
		}
	}

	const { name, type } = pet;
	app.locals.pets.push({ id, name, type });
	response.status(201).json({ name, type, id });
});

app.patch("/api/v1/pets/:id", (request, response) => {
	const { id } = request.params;

	let pet = app.locals.pets.find((pet) => pet.id === id);

	for (const key in request.body) {
		if (pet.hasOwnProperty(key)) {
			pet[key] = request.body[key];
		}
	}

	response.status(201).json(pet);
});

app.delete("/api/v1/pets/:id", (request, response) => {
	const { id } = request.params;

	let filtered = app.locals.pets.filter((pet) => pet.id !== id);

	app.locals.pets = [...filtered];

	response.status(201).json(filtered);
});

app.get("/", (request, response) => {});
