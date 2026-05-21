public class DsaExercise
{
    public int Id { get; set; }
    public string TestCases { get; set; }
    public string Title { get; set; }
    public string Difficulty { get; set; }
    public string Description { get; set; }
    public string Template { get; set; }
}

public class QuestionExercise
{
    public int Id { get; set; }
    public string Question { get; set; }
    public string Answer { get; set; }
    public string Category { get; set; }
}


public class RunCodeRequest
{
    public string Code { get; set; } = "";
    public string FnName { get; set; } = "";
    public List<TestCase> TestCases { get; set; } = new();
}

public class TestCase
{
    public List<object> Args { get; set; } = new();
    public object Expected { get; set; } = new();
}