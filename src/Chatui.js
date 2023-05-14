import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
let a="sk-Mnz36M7fsEOHkuF9OO36T";
let b="3BlbkFJh0MsykHStTitYFzKohJB";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
const config = {
  headers: {
    Authorization: `Bearer ${a+b}`,
    "Content-Type": "application/json",
    
  },
};
let msg = [];
export default function Chatui(props) {
  console.log(process.env.AUTH);
  const [chatHistory, setChatHistory] = useState([
    {
      user_message: null,
      ai_message: null,
    },
  ]);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");

  // 'https://api.openai.com/v1/engine/<YOUR_ENGINE_ID>/completions',

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    const bodyParameters = {
      model: "gpt-3.5-turbo",
      messages: msg,
    };
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      bodyParameters,
      config
    );
    console.log(response, "a");
    return response.data.choices[0].message.content;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newChatHistory = {
      user_message: input,
      ai_message: null,
    };
    msg.push({
      role: "user",
      content: input,
    });
    setChatHistory((prevChatHistory) => [...prevChatHistory, newChatHistory]);

    const response = await sendMessage();

    const newChatHistory1 = {
      user_message: null,
      ai_message: response,
    };
    msg.push({
      role: "assistant",
      content: response,
    });
    setChatHistory((prevChatHistory) => [...prevChatHistory, newChatHistory1]);

    setInput("");
  };

  return (
    <>
      <Grid container alignItems="center">
        <Grid item md={4} lg={4} />
        <Grid item xs={12} lg={4}>
          <Grid sx={{ overflow: "auto", minHeight: "80vh", maxHeight: "80vh" }}>
            {chatHistory.map((item, index) => (
              <>
                {item.user_message !== null && (
                  <Grid
                    container
                    sx={{ paddinTop: "3px", paddingBottom: "3px" }}
                    alignItems="flex-start"
                  >
                    <Grid
                      item
                      sx={{ backgroundColor: "#e8eaf6", borderRadius: "10px" }}
                    >
                      <Typography
                        padding={1.5}
                        variant="body1"
                        textAlign="left"
                      >
                        {item.user_message}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {item.ai_message && (
                  <Grid
                    container
                    sx={{ paddinTop: "3px", paddingBottom: "3px" }}
                    justifyContent="flex-end"
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Grid
                        sx={{
                          backgroundColor: "#b2dfdb",
                          borderRadius: "10px",
                        }}
                      >
                        <Typography padding={1.5} variant="body1" align="right">
                          {item.ai_message}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                <div ref={messagesEndRef} />
              </>
            ))}
          </Grid>

          <TextField
            fullWidth
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSubmit}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Grid>
        <Grid item md={4} lg={4} />
      </Grid>
    </>
  );
}
