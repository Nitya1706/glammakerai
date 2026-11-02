# GlamMaker

GlamMaker has a static frontend and a Flask API backed by MongoDB.

## Backend setup

1. Install and start MongoDB locally.
2. From the `GlamMaker` directory, create a virtual environment:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
   ```

3. Review `backend\.env`. Its values are for local development only. Keep the
   file private and replace `SECRET_KEY` with a strong random value before any
   deployment.
4. Start the website by double-clicking `start_glammaker.bat` in the project
   folder. It starts the Flask app if it is not already running and opens the
   home page in your browser. Keep MongoDB running.

   ```powershell
   # Alternatively, start it manually:
   .\.venv\Scripts\python.exe .\backend\app.py
   ```

5. The whole site uses the same address, `http://127.0.0.1:5000/`. Use the
   account icon to open login or registration; successful login takes you to
   the dashboard. Do not open the HTML files directly from disk, because that
   bypasses the Flask routes and API.

The API creates/uses the `glammaker` database and defines collection handles
for users, jewellery, try-on history, and recommendations. Registering an
account creates the unique email index on the users collection, validates the
submitted fields, hashes the password with bcrypt, and stores the account.

With Flask and MongoDB running, open
`http://127.0.0.1:5000/register.html`. The page loads
`frontend/js/auth.js`, submits registration to `/api/register`, and redirects
to `/login.html` on success. Opening the HTML file directly from disk will not
use the Flask API correctly. The existing static site and media remain in their
original locations so none of the existing project files or media are removed.

The login page uses `/api/login` to create a Flask session. The protected
`/dashboard.html` loads the current profile from `/api/user`; `/api/logout`
clears the session. Set a strong private `SECRET_KEY` in `backend/.env` before
using sessions outside local development.

The try-on page requires a signed-in session to submit images. It saves outfit
and jewellery files under `uploads/outfits/` and `uploads/jewellery/`, then
records their names in MongoDB's `tryon_history` collection. Uploads are limited
to PNG, JPG, JPEG, and WEBP files, with a 16 MB combined request limit. Visit
`/history.html` to view the signed-in user's saved images and timestamps.

The dashboard also links to `/ai-recommendation.html`, a local rule-based
jewellery recommendation feature. It requires a signed-in session and stores
each result and its occasion/outfit/style inputs in MongoDB's
`recommendations` collection.

The dashboard's AI Fashion Vision page classifies outfits using the trained
fashion CNN and matches its category to jewellery recommendations. Put
permission-cleared images into `dataset/train` and `dataset/validation`, using
the `saree`, `lehenga`, `gown`, `dress`, and `kurti` class subfolders in both.
Keep separate images for training and validation, and use images you have
permission to use.
Install TensorFlow with
`.\.venv\Scripts\python.exe -m pip install -r backend\requirements-ml.txt`,
then train from the project root using
`.\.venv\Scripts\python.exe .\backend\ai\train_fashion_model.py`. Training
creates `backend/ai/fashion_model.keras` and the class-name metadata used by
the predictor. TensorFlow compatibility depends on the Python and operating
system versions; the main application dependencies do not require TensorFlow.
The previous generic pretrained model remains available at `/api/ai/vision`.

The dashboard's Complete AI Style Analysis page combines the trained fashion
classifier with OpenCV outfit analysis, occasion-based and fashion-based
jewellery matching, and the AI style score. Successful results are saved to
MongoDB's `recommendations` collection with the signed-in user's ID and a
timestamp. The fashion model must be trained before this combined analysis can
run.

The AI Auto Stylist at `/ai-auto-stylist.html` uses the same trained fashion
classifier and OpenCV outfit analysis, then combines category-based jewellery
with recommendations for the selected occasion, detected color, and style.
Results are stored in the recommendations collection. Its uploaded image is
temporary and removed after analysis.

The admin dashboard is available at `/admin.html` only to accounts whose
MongoDB user document has `"role": "admin"`. New registrations default to
`"role": "user"`; promote an account manually in MongoDB, for example:

```javascript
use glammaker
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

The admin dashboard shows aggregate counts, recent user registrations, and
recent try-on/recommendation activity. Admins can view referenced uploads and
delete individual try-on or recommendation activity records. Deletion also
removes an upload file only when no remaining try-on or recommendation record
references that file.

The admin dashboard also provides 12-month user-growth, fashion-category,
occasion, and AI-activity charts, plus Excel exports for users, try-ons, and AI
records. Install `openpyxl` from `backend/requirements.txt` to use the exports.

The Personalized AI Stylist at `/ai-personalized.html` combines outfit
category, color, occasion, and style with the signed-in user's ten most recent
recommendation records. Its results are saved to the recommendations
collection and included in the admin analytics as recommendation activity.
