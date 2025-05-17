const cashfree = Cashfree({
  mode: "sandbox",
});
 document.getElementById("payBtn").addEventListener("click",async () => {
  try {
    const response=await axios.post("http://localhost:3000/pay");
    const paymentSessionId=response.data.paymentSessionId;
    let checkoutOptions = {
  paymentSessionId: paymentSessionId,
  redirectTarget: "_self",
  };
  const result=await cashfree.checkout(checkoutOptions);
  if(result.error){
    console.log("User has closed the popupor there is some payment error,Check for payment status");
    console.log(result.error);
  }if(result.redirect){
    console.log("Payment will be redirected");
  }if(result.paymentDetails){
    console.log("Payment has been completed,Check for payment status");
    console.log(result.paymentDetails.paymentMessage);
    const response=await axios.get(`http://localhost:3000/payment-status/${orderId}`);
    alert("Your payment is"+response.data.orderStatus)
  }
  } catch (error) {
    console.log(error); 
  }
});