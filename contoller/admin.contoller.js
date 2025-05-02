const pool = require("../connection/pool");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


module.exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = "SELECT * FROM tbl_admin WHERE BINARY username = ?";
    pool.query(query, [username], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal server error", status: true });
      }
      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Invalid credentials.", status: false });
      }
      const admin = result[0];
      if (password !== admin.password) {
        return res
          .status(404)
          .json({ message: "Invalid credentials", status: false });
      }
      if (result?.length > 0) {
        jwt.sign(
          { userId: result[0].id, username: result[0].username },
          process.env.JWTSECRETKEY,
          { expiresIn: "1d" },
          (err, token) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: "Failed to generate token" });
            } else {
              res.status(200).json({
                result: result[0],
                token,
                status: true,
                message: "Admin login successfully",
              });
            }
          }
        );
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in admin login", status: false });
  }
};

module.exports.handleEmailSending = (req, res) => {
  const { email, name, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mubark001418@gmail.com",
        pass: "hdvr bqse ysxr jxfw",
      },
    });
    const mailOptions = {
      from: email, // Sender's email
      to: "mubark001418@gmail.com", // Recipient's email
      subject: `New message from ${name} via Portfolio`, // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <header style="text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">New Message Notification</h1>
            </header>
            <main style="padding: 20px;">
                <p style="font-size: 16px; line-height: 1.5; color: #333;">
                    You have received a new message via your portfolio website.
                </p>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Name:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Email:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Message:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
                    </tr>
                </table>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Please respond to this email if necessary.
                </p>
            </main>
            <footer style="text-align: center; margin-top: 20px; padding: 10px; font-size: 14px; color: #888;">
                © ${new Date().getFullYear()} Your Portfolio. All rights reserved.
            </footer>
        </div>
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      } else {
        return res
          .status(200)
          .json({ status: true, message: "emial sent successfully", info });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, message: "error in email sending" });
  }
};

// home offer
module.exports.addOffer = (req, res) => {
  const { title, description } = req.body;
  const query = "INSERT INTO tbl_offer (title,description) VALUES (?,?)";
  try {
    pool.query(query, [title, description], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Offer add successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add offer", status: false });
  }
};
module.exports.getOffer = (req, res) => {
  const query = "SELECT * FROM tbl_offer";
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res.status(200).json({
          message: "Offer retrieved successfully",
          status: true,
          result,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get offer", status: false });
  }
};
module.exports.deleteOffer = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_offer WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Offer delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete offer", status: false });
  }
};
module.exports.updateOffer = (req, res) => {
  const { id, title, description } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    let query = "UPDATE tbl_offer SET ";
    const params = [];
    const field = {
      title: title,
      description: description,
    };
    for (const [key, value] of Object.entries(field)) {
      if (value !== undefined) {
        query += `${key} = ?, `;
        params.push(value);
      }
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    pool.query(query, params, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Offer update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update offer", status: false });
  }
};

// home banner
module.exports.addBanner = (req, res) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const newFilename = `${title}${path.extname(req.file.originalname)}`;
  const oldPath = req.file.path;
  const newPath = path.join(req.file.destination, newFilename);

  // Rename the file
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ msg: "Internal server error", success: false });
    }
  });
  const query =
    "INSERT INTO tbl_homebanner (title,description,imgurl) VALUES (?,?,?)";
  try {
    pool.query(query, [title, description, newFilename], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Banner add successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add Banner", status: false });
  }
};
module.exports.getBanner = (req, res) => {
  const query = "SELECT * FROM tbl_homebanner";
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res.status(200).json({
          message: "Banner retrieved successfully",
          status: true,
          result,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get Banner", status: false });
  }
};
module.exports.deleteBanner = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_homebanner WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Banner delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete offer", status: false });
  }
};
module.exports.updateBanner = (req, res) => {
  const { id, title, description } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    let query = "UPDATE tbl_homebanner SET ";
    const params = [];
    const field = {
      title: title,
      description: description,
    };
    for (const [key, value] of Object.entries(field)) {
      if (value !== undefined) {
        query += `${key} = ?, `;
        params.push(value);
      }
    }
    if (req.file) {
      const newFilename = `${title}${path.extname(req.file.originalname)}`;
      const oldPath = req.file.path;
      const newPath = path.join(req.file.destination, newFilename);

      // Rename the file
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ msg: "Internal server error", success: false });
        }
      });
      query += "imgurl = ?, ";
      queryParams.push(newFilename);
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    pool.query(query, params, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Banner update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update Banner", status: false });
  }
};

// about
module.exports.addAbout = (req, res) => {
  const { description } = req.body;
  const query = "INSERT INTO tbl_about (description) VALUES (?)";
  try {
    pool.query(query, [description], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "About add successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add About", status: false });
  }
};
module.exports.getAbout = (req, res) => {
  const query = "SELECT * FROM tbl_about";
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res.status(200).json({
          message: "About retrieved successfully",
          status: true,
          result,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get About", status: false });
  }
};
module.exports.deleteAbout = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_about WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "About delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete About", status: false });
  }
};
module.exports.updateAbout = (req, res) => {
  const { id, description } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    const query = "UPDATE tbl_about SET description = ? WHERE id = ?";
    pool.query(query, [description, id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "About update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update About", status: false });
  }
};

// skill
module.exports.addSkill = (req, res) => {
  const io = req.app.get('io');
  const { skill, knowledge } = req.body;
  const query = "INSERT INTO tbl_skill (skill,knowledge) VALUES (?,?)";
  try {
    pool.query(query, [skill, knowledge], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        const sendData = {
          id: result?.insertId,
          skill: skill,
          knowledge: knowledge
        }
        io.emit('sendSkill', sendData)
        return res
          .status(200)
          .json({ message: "Skill add successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add Skill", status: false });
  }
};
module.exports.getSkill = (req, res) => {
  const query = "SELECT * FROM tbl_skill";
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res.status(200).json({
          message: "Skill retrieved successfully",
          status: true,
          result,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get Skill", status: false });
  }
};
module.exports.deleteSkill = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_skill WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Skill delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete Skill", status: false });
  }
};
module.exports.updateSkill = (req, res) => {
  const io = req.app.get('io');
  const { id, skill, knowledge } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    let query = "UPDATE tbl_skill SET ";
    const params = [];
    const field = {
      skill: skill,
      knowledge: knowledge,
    };
    for (const [key, value] of Object.entries(field)) {
      if (value !== undefined) {
        query += `${key} = ?, `;
        params.push(value);
      }
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    pool.query(query, params, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        const sendData = {
          id: id,
          skill: skill,
          knowledge: knowledge,
        }
        io.emit('editSkill', sendData)
        return res
          .status(200)
          .json({ message: "Skill update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update Skill", status: false });
  }
};

// projects
module.exports.addProject = (req, res) => {
  const io = req.app.get('io');
  const { title, description, technologies, url, giturl, isComplete } = req.body;
  const query =
    "INSERT INTO tbl_project (title,description, technologies, url, giturl, imgurl, isComplete) VALUES (?,?,?,?,?,?,?)";
  try {
    pool.query(
      query,
      [title, description, technologies, url, giturl, req.files[0]?.filename, isComplete],
      (err, result) => {
        if (err) {
          console.log(err,'err')
          return res
            .status(505)
            .json({ message: "Internal server error", status: false });
        } else {
          const sendData = {
            id: result?.insertId,
            title: title,
            description: description,
            technologies: technologies,
            url: url,
            giturl: giturl,
            imgurl: `http://localhost:4000/uploads/${req.files[0]?.filename}`,
            isComplete: isComplete
          }
          io.emit('sendProject', sendData)
          return res
            .status(200)
            .json({ message: "Project add successfully", status: true });
        }
      }
    );
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add Project", status: false });
  }
};
module.exports.getProject = (req, res) => {
  const query = "SELECT * FROM tbl_project";
  const data = []
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        result?.forEach(r => {
          data.push({
            id: r?.id,
            title: r?.title,
            description: r?.description,
            technologies: r?.technologies,
            url: r?.url,
            giturl: r?.giturl,
            imgurl: `http://localhost:4000/uploads/${r?.imgurl}`,
            isComplete: r?.isComplete
          })
        });
        return res.status(200).json({
          message: "Project retrieved successfully",
          status: true,
          result: data,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get Project", status: false });
  }
};
module.exports.deleteProject = (req, res) => {
  const io = req.app.get('io')
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_project WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        io.emit('deleteProject', id)
        return res
          .status(200)
          .json({ message: "Project delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete Project", status: false });
  }
};
module.exports.updateProject = (req, res) => {
  const io = req.app.get('io');
  const { id, title, description, technologies, url, giturl, isComplete } = req.body;
  const sendData = {
    id: id,
    title: title,
    description: description,
    technologies: technologies,
    url: url,
    giturl: giturl,
    imgurl: req?.body?.file ? req?.body?.file :`http://localhost:4000/uploads/${req.files[0]?.filename}`,
    isComplete: isComplete
  }
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    let query = "UPDATE tbl_project SET ";
    const params = [];
    const field = {
      title: title,
      description: description,
      technologies: technologies,
      url: url,
      giturl: giturl,
      isComplete: isComplete
    };
    for (const [key, value] of Object.entries(field)) {
      if (value !== undefined) {
        query += `${key} = ?, `;
        params.push(value);
      }
    }
    if (req.files?.length > 0) {
      query += `imgurl = ?, `;
      params.push(req.files[0]?.filename)
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    pool.query(query, params, (err, result) => {
      if (err) {
        console.log(err,'error')
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        io.emit('sendEditProject', sendData)
        return res
          .status(200)
          .json({ message: "Project update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update Project", status: false });
  }
};

// experience
module.exports.addExperience = (req, res) => {
  const { title, description, company, time } = req.body;
  const query =
    "INSERT INTO tbl_experience (title, company, time,description) VALUES (?,?,?,?)";
  try {
    pool.query(query, [title, company, time, description], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Experience add successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in add Experience", status: false });
  }
};
module.exports.getExperience = (req, res) => {
  const query = "SELECT * FROM tbl_experience";
  try {
    pool.query(query, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res.status(200).json({
          message: "Experience retrieved successfully",
          status: true,
          result,
        });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in get Experience", status: false });
  }
};
module.exports.deleteExperience = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  const query = "DELETE FROM tbl_experience WHERE id = ?";
  try {
    pool.query(query, [id], (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Experience delete successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in delete Experience", status: false });
  }
};
module.exports.updateExperience = (req, res) => {
  const { id, title, description, company, time } = req.body;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  try {
    let query = "UPDATE tbl_experience SET ";
    const params = [];
    const field = {
      title: title,
      description: description,
      company: company,
      time: time,
    };
    for (const [key, value] of Object.entries(field)) {
      if (value !== undefined) {
        query += `${key} = ?, `;
        params.push(value);
      }
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    pool.query(query, params, (err, result) => {
      if (err) {
        return res
          .status(505)
          .json({ message: "Internal server error", status: false });
      } else {
        return res
          .status(200)
          .json({ message: "Experience update successfully", status: true });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "error in update Experience", status: false });
  }
};