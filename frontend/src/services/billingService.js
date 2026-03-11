import api from "./api";

const billingService = {
  async getSubscription() {
    const { data } = await api.get("/billing/subscription");
    return data;
  },

  async createCheckoutSession() {
    const { data } = await api.post("/billing/checkout");
    return data;
  },
};

export default billingService;