import API from "./api";

const billingService = {
  async getSubscription() {
    const { data } = await API.get("/billing/subscription");
    return data;
  },

  async createCheckoutSession() {
    const { data } = await API.post("/billing/checkout");
    return data;
  },
};

export default billingService;