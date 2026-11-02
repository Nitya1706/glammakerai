const categories = [
    {
        id: "daily",
        title: "Daily",
        occasions: [
            "College",
            "Office / Work",
            "Casual Outing",
            "Shopping",
            "Brunch",
            "Coffee / Cafe",
            "Daily Traditional Wear",
        ],
    },
    {
        id: "traditional-festivals",
        title: "Traditional & Festivals",
        occasions: [
            "Diwali",
            "Ganesh Chaturthi",
            "Navratri",
            "Gudi Padwa",
            "Dussehra",
            "Holi",
            "Raksha Bandhan",
            "Janmashtami",
            "Eid",
            "Onam",
            "Pongal",
            "Puja",
            "Traditional Family Function",
        ],
    },
    {
        id: "wedding",
        title: "Wedding",
        occasions: [
            "Engagement",
            "Haldi",
            "Mehndi",
            "Sangeet",
            "Wedding Ceremony",
            "Reception",
            "Bridal",
            "Family Wedding",
            "Cocktail / Wedding Party",
        ],
    },
    {
        id: "party-social",
        title: "Party & Social",
        occasions: [
            "Birthday Party",
            "House Party",
            "Cocktail Party",
            "Dinner Party",
            "Date Night",
            "Night Out",
            "College Party",
            "Farewell Party",
            "Reunion",
        ],
    },
    {
        id: "formal-professional",
        title: "Formal & Professional",
        occasions: [
            "Office",
            "Interview",
            "Business Meeting",
            "Conference",
            "Seminar",
            "Corporate Event",
            "Presentation",
            "Networking Event",
            "Award Ceremony",
        ],
    },
    {
        id: "special-occasions",
        title: "Special Occasions",
        occasions: [
            "Anniversary",
            "Valentine's Day",
            "Proposal",
            "Graduation",
            "Baby Shower",
            "Bridal Shower",
            "Birthday",
            "Housewarming",
            "Family Celebration",
        ],
    },
    {
        id: "evening-luxury",
        title: "Evening & Luxury",
        occasions: [
            "Gala",
            "Red Carpet",
            "Luxury Dinner",
            "Black-Tie Event",
            "Luxury Party",
            "Evening Wedding",
            "Formal Evening",
            "Cocktail Evening",
            "Romantic Dinner",
        ],
    },
];

const jewelleryAreas = [
    { id: "hand", label: "Hand", icon: "fa-hand-sparkles" },
    { id: "neck", label: "Neck", icon: "fa-gem" },
    { id: "nose", label: "Nose", icon: "fa-circle" },
    { id: "feet", label: "Feet", icon: "fa-shoe-prints" },
    { id: "ear", label: "Ear", icon: "fa-ear-listen" },
];

const slugify = (value) => value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const params = new URLSearchParams(window.location.search);
const category = categories.find((item) => item.id === params.get("category"));
const title = document.getElementById("categoryTitle");
const occasionOptions = document.getElementById("occasionOptions");
const jewelleryOptions = document.getElementById("jewelleryOptions");
const form = document.getElementById("occasionSelectionForm");
const continueButton = document.getElementById("continueToTryOn");
const selectionMessage = document.getElementById("selectionMessage");

function showInvalidCategory() {
    title.textContent = "Choose an occasion";
    form.replaceChildren();
    const error = document.createElement("p");
    error.className = "selection-error";
    error.textContent = "That occasion category could not be found. ";
    const link = document.createElement("a");
    link.href = "index.html#occasions";
    link.textContent = "Return to all occasion categories.";
    error.append(link);
    form.append(error);
}

function addChoice(container, { id, label, type, name, icon }, index) {
    const choice = document.createElement("label");
    choice.className = type === "checkbox" ? "jewellery-choice" : "occasion-choice";

    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = id;
    input.id = `${name}-${id}`;
    if (type === "radio" && index === 0) input.required = true;

    if (icon) {
        const iconElement = document.createElement("i");
        iconElement.className = `fa-solid ${icon}`;
        iconElement.setAttribute("aria-hidden", "true");
        choice.append(input, iconElement, document.createTextNode(label));
    } else {
        choice.append(input, document.createTextNode(label));
    }
    container.append(choice);
}

if (!category) {
    showInvalidCategory();
} else {
    document.title = `${category.title} Occasions | GlamMaker`;
    title.replaceChildren(
        document.createTextNode(`${category.title} `),
        Object.assign(document.createElement("em"), { textContent: "Occasions" })
    );

    category.occasions.forEach((label, index) => {
        addChoice(occasionOptions, {
            id: slugify(label),
            label,
            type: "radio",
            name: "event",
        }, index);
    });

    jewelleryAreas.forEach((area, index) => {
        addChoice(jewelleryOptions, {
            ...area,
            type: "checkbox",
            name: "jewellery_type",
        }, index);
    });

    form.addEventListener("change", () => {
        const hasOccasion = Boolean(form.querySelector('input[name="event"]:checked'));
        const hasJewelleryArea = Boolean(form.querySelector('input[name="jewellery_type"]:checked'));
        continueButton.disabled = !hasOccasion || !hasJewelleryArea;
        selectionMessage.textContent = continueButton.disabled
            ? "Select an occasion and at least one jewellery area."
            : "Your selections are ready. Continue to upload your look.";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedEvent = form.querySelector('input[name="event"]:checked');
        const selectedAreas = [...form.querySelectorAll('input[name="jewellery_type"]:checked')];
        if (!selectedEvent || selectedAreas.length === 0) return;

        const tryOnParams = new URLSearchParams({
            occasion: category.id,
            occasion_label: category.title,
            event: selectedEvent.value,
            event_label: category.occasions.find(
                (item) => slugify(item) === selectedEvent.value
            ),
        });
        selectedAreas.forEach((area) => tryOnParams.append("jewellery_type", area.value));
        window.location.href = `tryon.html?${tryOnParams.toString()}`;
    });
}
