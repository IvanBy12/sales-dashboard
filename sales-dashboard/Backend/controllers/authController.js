const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = [{ email: "admin@test.com", password: bcrypt.hashSync("123456", 10) }];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ email }, "secreto", { expiresIn: "1h" });
  res.json({ token });
};
