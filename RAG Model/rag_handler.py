# rag_handler.py (Ollama & GPU Enabled)
# This version uses a locally run Ollama model for fast, private, and free generation.

import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_community.huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
import glob
from langchain_community.llms import Ollama # Import the Ollama LLM
from langchain_huggingface import HuggingFaceEmbeddings 


# --- Configuration ---
DATA_PATH = 'data/'
DB_FAISS_PATH = 'vectorstore/db_faiss'
PROCESSED_FILES_LOG = 'vectorstore/processed_files.log'
EMBEDDING_MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'

def get_processed_files():
    """Reads the log file and returns a set of processed filenames."""
    if not os.path.exists(PROCESSED_FILES_LOG):
        return set()
    # --- FIX IS HERE ---
    with open(PROCESSED_FILES_LOG, 'r', encoding='utf-8') as f:
        return set(f.read().splitlines())

def log_processed_files(filenames):
    """Appends a list of newly processed filenames to the log."""
    # --- FIX IS HERE ---
    with open(PROCESSED_FILES_LOG, 'a', encoding='utf-8') as f:
        for filename in filenames:
            f.write(f"{filename}\n")

def process_documents(file_paths):
    """Loads, splits, and creates embeddings for a list of document paths."""
    print(f"Processing {len(file_paths)} new document(s)...")
    docs = []
    count = 0
    for path in file_paths:
        count += 1
        if count % 10 == 0:
            print(f"Processed {count} documents so far...")
        loader = PyPDFLoader(path)
        docs.extend(loader.load())
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(docs)
    
    print("Initializing embeddings model on GPU...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={'device': 'cuda'}
    )
    
    return texts, embeddings

def update_vector_db():
    """
    Checks for new documents in the data path, processes them, 
    and adds them to the existing FAISS database.
    """
    processed_files = get_processed_files()
    all_files = set(glob.glob(os.path.join(DATA_PATH, "**/*.pdf"), recursive=True))
    
    all_files_relative = {os.path.relpath(f, DATA_PATH) for f in all_files}
    new_files_relative = list(all_files_relative - processed_files)

    if not new_files_relative:
        print("No new documents to process. Database is up-to-date.")
        return

    print(f"Found {len(new_files_relative)} new document(s) to add.")
    
    new_files_full_path = [os.path.join(DATA_PATH, f) for f in new_files_relative]
    
    new_texts, embeddings = process_documents(new_files_full_path)
    
    print("Loading existing vector store...")
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    
    print("Adding new documents to the vector store...")
    db.add_documents(new_texts)
    
    print("Saving updated vector store...")
    db.save_local(DB_FAISS_PATH)
    
    log_processed_files(new_files_relative)
    print("Database update complete.")

def create_vector_db():
    """Creates the initial vector database from all documents."""
    all_files = glob.glob(os.path.join(DATA_PATH, "**/*.pdf"), recursive=True)
    if not all_files:
        print(f"No documents found in '{DATA_PATH}'. Please add PDF files.")
        return

    texts, embeddings = process_documents(all_files)
    
    print("Creating FAISS vector store...")
    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)
    
    print("Initial vector store created successfully.")
    all_files_relative = [os.path.relpath(f, DATA_PATH) for f in all_files]
    log_processed_files(all_files_relative)
    print(f"Initial vector store created and saved at {DB_FAISS_PATH}")

# --- Setup function for the API ---
def setup_qa_chain():
    """Sets up the QA chain for the API to use."""
    print("Setting up the QA chain...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME, model_kwargs={'device': 'cuda'})
    if not os.path.exists(DB_FAISS_PATH):
        print("Vector store not found. Please run the script to create it first.")
        return None
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    retriever = db.as_retriever(search_kwargs={'k': 3})
    
    print("Initializing local LLM with Ollama...")
    llm = Ollama(model="llama3.1:4b") # Ensure you have pulled this model
    
    qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type='stuff', retriever=retriever, return_source_documents=True)
    print("QA chain is ready.")
    return qa_chain

# --- Main Execution Block ---
if __name__ == '__main__':
    os.makedirs('vectorstore', exist_ok=True)
    
    if not os.path.exists(DB_FAISS_PATH):
        print("No existing database found. Creating a new one.")
        create_vector_db()
    else:
        print("Existing database found. Checking for updates.")
        update_vector_db()
