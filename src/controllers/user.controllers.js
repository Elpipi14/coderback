import * as userService from "../service/user.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isRegistered = await userService.register({ ...req.body, email, password });

    if (!isRegistered) {
      console.log("Usuario registrado correctamente. Redirigiendo a /profile");
      res.redirect("/profile");
    } else {
      console.log("Error en el registro. Redirigiendo a /register-error");
      res.redirect("/register-error");
    }
  } catch (error) {
    console.error("Error durante el registro:", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    if (user) {
      req.session.welcomeMessage = `Bienvenido, ${user.first_name} ${user.last_name}!`;
      req.session.isAdmin = user.role === 'admin';
      req.session.user = user;

      req.session.save((err) => {
        if (err) {
          console.error('Error al guardar la sesión:', err);
          res.status(500).json({ error: 'Error al guardar la sesión' });
        } else {
          res.redirect("/products");
        }
      });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    next(error);
  }
};

export const sessionCurrent = (req, res) => {
  try {
    // Verifica si el usuario está autenticado
    if (req.isAuthenticated()) {
      // Obtiene la información del usuario actual desde la sesión
      const { first_name, last_name, email, role, cartId, isGithub } = req.user;

      res.status(200).json({
        message: "Usuario autenticado",
        user: { first_name, last_name, email, role, cartId, isGithub},
      });
    } else {
      res.status(401).json({ error: "Usuario no autenticado" });
    }
  } catch (error) {
    console.error("Error al obtener la sesión actual:", error);
    res.status(500).json({ error: "Error al obtener la sesión actual" });
  }
};

export const githubResponse = async(req, res, next)=>{
  try {
      const { first_name, last_name, email, isGithub } = req.user;
      res.json({
          msg: 'Register/Login Github OK',
          session: req.session,
          userData: {
              first_name,
              last_name,
              email,
              isGithub
          }
      })
  } catch (error) {
      next(error);
  }
};


export const logout = (req, res) => {
  console.log("Antes de destruir la sesión");
  req.session.destroy(() => {
    console.log(`Después de destruir la sesión`);
    res.redirect("/login");
  });
};
