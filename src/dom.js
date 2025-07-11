export const initialize = () => {
    let state = {
        inboxBtn: document.getElementById("inbox-btn"),
        todayBtn: document.getElementById("today-btn"),
        tomorrowBtn: document.getElementById("tomorrow-btn")
    };

    return {
        get inboxBtn() {
            return state.inboxBtn;
        },
        get todayBtn() {
            return state.todayBtn;
        },
        get tomorrowBtn() {
            return state.tomorrowBtn;
        }
    };
};