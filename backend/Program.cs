using System;
using Npgsql;
using System.IO;

class Program
{
    static void Main()
    {
        string connectionString = File.ReadAllText("dbcredentials.txt");

        using var connection = new NpgsqlConnection(connectionString);
        connection.Open();

        string sql = "SELECT * FROM public.\"DSA_EXERCISES\"";
        using var command = new NpgsqlCommand(sql, connection);

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            int id = reader.GetInt32(0);
            string testCases = reader.GetString(1);
            string title = reader.GetString(2);
            string difficulty = reader.GetString(3);
            string description = reader.GetString(4);
            Console.WriteLine($"ID: {id}");
            Console.WriteLine($"Test Cases: {testCases}");
            Console.WriteLine($"Title: {title}");
            Console.WriteLine($"Difficulty: {difficulty}");
            Console.WriteLine($"Description: {description}");
        }
    }
}