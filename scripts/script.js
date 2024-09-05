const app = new WaveApp("#app");

const store = new WaveStore({
    data: {
        count: 0,
    }
});

try {
    app.useStore(store);
}
catch (err) {
    console.error("Failed to use store", store, " due to", err);
}

try {
    app.mount();
}
catch (err) {
    console.error("Failed to mount app due to", err);
}

function increment(amount) {
    store.setValue("count", store.getValue("count") + amount);
}

function reset() {
    store.setValue("count", 0);
}