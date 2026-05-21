using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;
using System.IO;

namespace DsaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DsaController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<DsaExercise>> GetExercises()
        {
            var exercises = new List<DsaExercise>();
            string connectionString = System.IO.File.ReadAllText("../dbcredentials.txt");

            using var connection = new NpgsqlConnection(connectionString);
            connection.Open();

            string sql = "SELECT * FROM public.\"DSA_EXERCISES\"";
            using var command = new NpgsqlCommand(sql, connection);

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                var exercise = new DsaExercise
                {
                    Id = reader.GetInt32(0),
                    TestCases = reader.GetString(1),
                    Title = reader.GetString(2),
                    Difficulty = reader.GetString(3),
                    Description = reader.GetString(4),
                    Template = reader.GetString(5)
                };
                exercises.Add(exercise);
            }

            return Ok(exercises);
        }

        [HttpGet("questions")]
        public ActionResult<List<QuestionExercise>> GetQuestionExercises()
        {
            var exercises = new List<QuestionExercise>();
            string connectionString = System.IO.File.ReadAllText("../dbcredentials.txt");

            using var connection = new NpgsqlConnection(connectionString);
            connection.Open();

            string sql = "SELECT * FROM public.\"QUESTION_EXERCISES\"";
            using var command = new NpgsqlCommand(sql, connection);

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                var exercise = new QuestionExercise
                {
                    Id = reader.GetInt32(0),
                    Question = reader.GetString(1),
                    Answer = reader.GetString(2),
                    Category = reader.GetString(3),
                };
                exercises.Add(exercise);
            }

            return Ok(exercises);
        }

        [HttpPost("run")]
        public ActionResult RunCode([FromBody] RunCodeRequest request)
        {
            var results = new List<object>();

            foreach (var testCase in request.TestCases)
            {
                try
                {
                    var engine = new Jint.Engine();
                    engine.Execute(request.Code);

                    var argsJson = System.Text.Json.JsonSerializer.Serialize(testCase.Args);
                    var result = engine.Evaluate($"{request.FnName}(...{argsJson})");
                    var resultJson = System.Text.Json.JsonSerializer.Serialize(result.ToObject());

                    var expectedJson = System.Text.Json.JsonSerializer.Serialize(testCase.Expected);
                    var wrappedResultJson = $"[{resultJson}]";
                    var passed = expectedJson.Contains(resultJson);
                    results.Add(new { passed, result = result.ToObject(), expected = testCase.Expected, error = (string?)null });
                }
                catch (Exception e)
                {
                    results.Add(new { passed = false, result = (object?)null, expected = testCase.Expected, error = e.Message });
                }
            }

            return Ok(results);
        }
    }
}