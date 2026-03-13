#include "httplib.h"
#include <iostream>
#include <string>
#include <cstdlib>

std::string execute_llama_cpp(const std::string& prompt) {
    // Model configuration locked for 12GB RAM architecture.
    // -c 4096 ensures the context window doesn't overflow memory.
    // -t 4 utilizes the 4 threads of the i3-8100t.
    std::string run_cmd = "./llama.cpp/main -m models/phi3.gguf -p \"" + prompt + "\" -n 512 -c 4096 -t 4 > output.txt";
    system(run_cmd.c_str());

    // In a production environment, read 'output.txt' contents here
    return "Output successfully written to local disk by llama.cpp.";
}

int main() {
    httplib::Server svr;

    svr.Options("/inference", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
    });

    svr.Post("/inference", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        
        std::string prompt = req.body;
        std::cout << "[C++ Engine] Incoming task received." << std::endl;
        
        std::string output = execute_llama_cpp(prompt);
        res.set_content(output, "text/plain");
    });

    std::cout << "TeamClubAI C++ Inference Engine listening on port 8080..." << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
}
