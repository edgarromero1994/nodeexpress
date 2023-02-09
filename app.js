const express = require("express");
const app = express();
const swaggerDocument = require("./swagger.json");
const jwt = require("jsonwebtoken");


app.use(express.urlencoded({extended: false}));
//middelware

// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
app.use(express.json())
// Endpoint para listar productos
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.post("/login", (req, res) => {
  const userId = 1;
  const username = "edgar";
  jwt.sign({ userId, username }, "secretkey", { expiresIn: "5m" }, (err, token) => {
    res.json({
      token
    });
  });
});

// Authorization middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

//para las marcas

const marca = [
  {
      id: 300,
      nombre: "Adidas",
      descripcion:"Es una marca Deportiva",
      eliminado_suave: false
  }
]

//listas productos 
app.get("/marca", verifyToken,(req, res)=> {
  res.send(marca)
})

/// post 
app.post("/marca",  (req, res)=>{
  let maxID = 0;
  for (let i = 0; i < marca.length; i++) {
      if (marca[i].id > maxID) {
          maxID = marca[i].id;
      }
  }
  const nuevaMarca =  {
      id: maxID + 1,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
  }

  marca.push(nuevaMarca)
  res.send(marca)
})

//endpoint para editar marca 
app.put('/marca/:id',verifyToken, (req, res) => {
  const id = marca.findIndex(marcas => marcas.id === parseInt(req.params.id));
  if (id >= 0) {
      const updated = {
          id: parseInt(req.params.id),
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
      }
      marca.splice(id, 1, updated)
      res.send(marca[id])
  } else {
      res.status(404).send(`error datos no encontrado id:${req.params.id}`)
  }
});

//endpoint para eliminar marca 
app.delete('/marca/:id', verifyToken, (req, res) => {
  const id = marca.findIndex(marcas => marcas.id === parseInt(req.params.id));
  if (id >= 0) {
      marca.splice(id, 1);
      res.status(200).send({ message: "Marca eliminado con éxito" });
  } else {
      res.status(404).send({ message: "Marca no encontrado" });
  }
});

//endpoint para eliminar suave marca 
app.delete('/marca/suave/:id', verifyToken, (req, res) => {
  const id = marca.findIndex(marcas => marcas.id === parseInt(req.params.id));
  if (id >= 0) {
      marca[id].eliminado_suave = true;
      res.status(200).send({ message: "Marca eliminada suavemente con éxito" });
  } else {
      res.status(404).send({ message: "Marca no encontrada" });
  }
});

//listas marcas activas
app.get("/marca/activo", verifyToken, (req, res)=> {
  const marcasActivas = marca.filter(m => !m.eliminado_suave);
  res.send(marcasActivas);
});


//lista de linea 
const linea = [
  {
      id: 200,
      nombre: "Linea electronica",
      descripcion:"Televisiones",
      eliminado_suave: false

  }
]

//endpoint para lista de lineas 
app.get("/linea",verifyToken,(req, res)=> {
  res.send(linea)
})

//endpoint para agregar nueva linea de productos
app.post("/linea", verifyToken, (req, res)=>{
  let maxID = 0;
  for (let i = 0; i < linea.length; i++) {
      if (linea[i].id > maxID) {
          maxID = linea[i].id;
      }
  }

  const nuevaLinea =  {
      id: maxID + 1,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
  }
  linea.push(nuevaLinea)
  res.send(linea)
})

// endpoint para editar marca 
app.put('/linea/:id',verifyToken, (req, res) => {
  const id = linea.findIndex(lineas => lineas.id === parseInt(req.params.id));
  if (id >= 0) {
      const updated = {
          id: parseInt(req.params.id),
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
      }
      linea.splice(id, 1, updated)
      res.send(linea[id])
  } else {
      res.status(404).send(`error datos no encontrado id:${req.params.id}`)
  }
});

//endpoint para eliminar linea
app.delete('/linea/:id', verifyToken, (req, res) => {
  const id = linea.findIndex(lineas => lineas.id === parseInt(req.params.id));
  if (id >= 0) {
      linea.splice(id, 1);
      res.status(200).send({ message: "Linea eliminado con éxito" });
  } else {
      res.status(404).send({ message: "Linea no encontrado" });
  }
});
//endpoint para eliminado suave
app.delete('/linea/suave/:id', verifyToken, (req, res) => {
  const id = linea.findIndex(lineas => lineas.id === parseInt(req.params.id));
  if (id >= 0) {
      linea[id].eliminado_suave = true;
      res.status(200).send({ message: "Marca eliminada suavemente con éxito" });
  } else {
      res.status(404).send({ message: "Marca no encontrada" });
  }
});

//listas marcas activas
app.get("/linea/activo", verifyToken, (req, res)=> {
  const lineasActivas = linea.filter(m => !m.eliminado_suave);
  res.send(lineasActivas);
});

let products = [
  {
      id: 200,
      cantidad: 100,
      nombre: "playera",
      precio: 100,
      marca: "Adidas",
      linea: 1
  }
];

//para en listr el producto 
app.get('/products', verifyToken,(req, res) => {
res.send(products);
});
// Endpoint para agregar un producto
app.post('/products', verifyToken, (req, res) => {
let maxID = 0;
for (let i = 0; i < products.length; i++) {
    if (products[i].id > maxID) {
        maxID = products[i].id;
    }
}
  const nuevoProducts={
      id: maxID + 1,
      cantidad:req.body.cantidad,
      nombre:req.body.nombre,
      precio:req.body.precio,
      marca:req.body.marca,
      linea:req.body.linea
  }
  products.push(nuevoProducts)
  res.send(products)
});

//endpoint para editar productos 
app.put('/products/:id',verifyToken, (req, res) => {
  const id = products.findIndex(product => product.id === parseInt(req.params.id));
  if (id >= 0) {
      const updated = {
      id: parseInt(req.params.id),
      cantidad:req.body.cantidad,
      nombre:req.body.nombre,
      precio:req.body.precio,
      marca:req.body.marca,
      linea:req.body.linea  
      }
      products.splice(id, 1, updated)
      res.send(products[id])
  } else {
      res.status(404).send(`error datos no encontrado id:${req.params.id}`)
  }
});

// Endpoint para eliminar un producto
app.delete('/products/:id', verifyToken,  (req, res) => {
  const id = products.findIndex(product => product.id === parseInt(req.params.id));
  if(id >= 0){
      products.splice(id, 1);
      res.status(200).send({ message: "Producto eliminado con éxito" });
  }else{
      res.status(404).send({ message: "Producto no encontrado" });
  }
});

//realizar una venta 
app.put('/products/compra/:id',verifyToken,  (req, res) => {
  const id = products.findIndex(products => products.id === parseInt(req.params.id));
  if(id >= 0){
      products[id].cantidad -= req.body.cantidadComprada;
      res.send(products[id]);
  }else{
      res.status(404).send(`error datos no encontrado id:${req.params.id}`)
  }
});

//para ver todos los productos comprados
app.get('/compras/total', (req, res) => {
  let compras = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].cantidad < products[i].cantidadInicial) {
      compras.push({
        id: products[i].id,
        cantidadComprada: products[i].cantidadInicial - products[i].cantidad,
        precioTotal: (products[i].cantidadInicial - products[i].cantidad) * products[i].precio
      });
    }
  }
  res.send(compras);
});

//productos en exitencia 
app.get('/products/existencia', (req, res) => {
  let productosExistentes = products.filter(product => product.cantidad > 0);
  res.send(productosExistentes);
});

//para subir en el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`API corriendo en el puerto ${port}`);
});


